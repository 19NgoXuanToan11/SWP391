using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Data.Models;
using System.Net.Http.Json;

namespace Service
{
    public class PayosService : IPayosService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PayosService> _logger;

        // Constructor to initialize HttpClient, Configuration, and Logger
        public PayosService(HttpClient httpClient, IConfiguration configuration, ILogger<PayosService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;

            // Set default headers for all requests (PayOS API Headers)
            _httpClient.DefaultRequestHeaders.Add("x-client-id", _configuration["Payos:ClientId"]);
            _httpClient.DefaultRequestHeaders.Add("x-api-key", _configuration["Payos:ApiKey"]);
            _httpClient.DefaultRequestHeaders.Add("x-partner-code", _configuration["Payos:PartnerCode"]);
        }

        public async Task<PaymentResponse> CreatePaymentRequest(int orderId, decimal amount, string description, string buyerName, string buyerEmail, string buyerPhone, string buyerAddress)
        {
            try
            {
                string returnUrl = _configuration["Payos:ReturnUrl"];
                string cancelUrl = _configuration["Payos:CancelUrl"];

                // Create HMAC-SHA256 signature
                string signature = CreateHmacSignature(
                    $"amount={amount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderId}&returnUrl={returnUrl}",
                    _configuration["Payos:ChecksumKey"]
                );

                var payload = new
                {
                    orderCode = orderId,
                    amount = (int)(amount * 100),  // PayOS requires smallest unit (cent)
                    description = description,
                    buyerName = buyerName,
                    buyerEmail = buyerEmail,
                    buyerPhone = buyerPhone,
                    buyerAddress = buyerAddress,
                    items = new object[] { },  // Product list (if any)
                    cancelUrl = cancelUrl,
                    returnUrl = returnUrl,
                    expiredAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + 86400,  // Expiry time (24 hours)
                    signature = signature
                };

                // Log the complete request payload for debugging
                _logger.LogInformation($"Request Payload: {JsonSerializer.Serialize(payload)}");

                // Send the HTTP POST request to the PayOS API
                var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("https://api-merchant.payos.vn/v2/payment-requests", jsonContent);
                var responseContent = await response.Content.ReadAsStringAsync();

                // Log the response for debugging purposes
                _logger.LogInformation($"Response from PayOS: {response.StatusCode} - {responseContent}");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"PayOS API Error: {responseContent}");
                    throw new Exception($"Failed to create payment request: {responseContent}");
                }

                // Deserialize the response to PaymentResponse object
                var paymentResponse = JsonSerializer.Deserialize<PaymentResponse>(responseContent);

                // Check for valid response, especially for PaymentUrl
                if (paymentResponse?.Data?.PaymentUrl != null)
                {
                    return paymentResponse;
                }
                else
                {
                    _logger.LogError("No PaymentUrl in the response from PayOS.");
                    throw new Exception("No payment URL returned from PayOS.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating payment: {ex.Message}");
                throw;
            }
        }


        // Handle webhook from PayOS (used after payment completion)
        public async Task HandleWebhook(PayosWebhookPayload payload, string receivedSignature)
        {
            try
            {
                // Log the received webhook
                _logger.LogInformation($"Received Webhook from PayOS: {JsonSerializer.Serialize(payload)}");

                // Verify the signature to ensure data integrity
                if (!VerifyWebhookSignature(payload, receivedSignature))
                {
                    _logger.LogError("Invalid Webhook Signature!");
                    throw new Exception("Signature verification failed");
                }

                // Process the webhook data (e.g., update payment status)
                _logger.LogInformation("Webhook verified successfully!");

                // Add additional logic here for processing the webhook payload, like updating payment status, etc.
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing Webhook: {ex.Message}");
                throw;
            }
        }

        // Verify Webhook Signature using HMAC-SHA256
        private bool VerifyWebhookSignature(PayosWebhookPayload payload, string receivedSignature)
        {
            var key = _configuration["Payos:ChecksumKey"];  // Secret key from configuration
            var dataStr = $"amount={payload.Data.Amount}" +
                          $"&description={payload.Data.Description}" +
                          $"&orderCode={payload.Data.OrderCode}" +
                          $"&paymentLinkId={payload.Data.PaymentLinkId}" +
                          $"&status={payload.Data.Code}" +
                          $"&transactionDateTime={payload.Data.TransactionDateTime}";

            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dataStr));
                var computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                return computedSignature.Equals(receivedSignature, StringComparison.OrdinalIgnoreCase);
            }
        }
        // Get payment request info from PayOS API
        public async Task<PaymentResponse> GetPaymentRequestInfo(string paymentId)
        {
            var response = await _httpClient.GetAsync($"https://api-merchant.payos.vn/v2/payment-requests/{paymentId}");
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<PaymentResponse>(responseContent);
        }

        // Cancel payment request
        public async Task<PaymentResponse> CancelPaymentRequest(string paymentId, string cancellationReason)
        {
            var payload = new { cancellationReason = cancellationReason };
            var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"https://api-merchant.payos.vn/v2/payment-requests/{paymentId}/cancel", jsonContent);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<PaymentResponse>(responseContent);
        }

        // Update webhook URL in PayOS
        public async Task<bool> UpdateWebhookAsync()
        {
            var requestBody = new { webhookUrl = _configuration["Payos:WebhookUrl"] };
            var response = await _httpClient.PostAsJsonAsync("https://api-merchant.payos.vn/confirm-webhook", requestBody);
            return response.IsSuccessStatusCode;
        }

        // Confirm webhook URL
        public async Task<bool> ConfirmWebhookAsync()
        {
            return await UpdateWebhookAsync();
        }
        // Create HMAC Signature for request (used in CreatePaymentRequest)
        private string CreateHmacSignature(string data, string key)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                return BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(data))).Replace("-", "").ToLower();
            }
        }
    }
}
