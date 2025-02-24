using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Data.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Service
{
    public interface IPayosService
    {
        Task<PaymentResponse> CreatePaymentRequest(int orderId, decimal amount, string description);
        Task HandleWebhook(PayosWebhookPayload payload, string signature);
    }

    public class PayosService : IPayosService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PayosService> _logger;

        public PayosService(
            IConfiguration configuration, 
            IPaymentService paymentService,
            ILogger<PayosService> logger)
        {
            _configuration = configuration;
            _paymentService = paymentService;
            _logger = logger;
            
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = 
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
            _httpClient = new HttpClient(handler);
            
            // Add required headers
            _httpClient.DefaultRequestHeaders.Add("x-client-id", _configuration["Payos:ClientId"]);
            _httpClient.DefaultRequestHeaders.Add("x-api-key", _configuration["Payos:ApiKey"]);
        }

        public async Task<PaymentResponse> CreatePaymentRequest(int orderId, decimal amount, string description)
        {
            try
            {
                var checksumKey = _configuration["Payos:ChecksumKey"] 
                    ?? throw new InvalidOperationException("Payos:ChecksumKey is not configured");
                var cancelUrl = _configuration["Payos:CancelUrl"]
                    ?? throw new InvalidOperationException("Payos:CancelUrl is not configured");
                var returnUrl = _configuration["Payos:ReturnUrl"]
                    ?? throw new InvalidOperationException("Payos:ReturnUrl is not configured");

                var payosRequest = new
                {
                    orderCode = orderId,
                    amount = (int)(amount * 100),
                    description = description,
                    cancelUrl = cancelUrl,
                    returnUrl = returnUrl,
                    items = new object[] { },
                    buyerName = "",
                    buyerEmail = "",
                    buyerPhone = "",
                    buyerAddress = ""
                };

                // Create signature string
                var dataStr = $"amount={payosRequest.amount}" +
                             $"&cancelUrl={payosRequest.cancelUrl}" +
                             $"&description={payosRequest.description}" +
                             $"&orderCode={payosRequest.orderCode}" +
                             $"&returnUrl={payosRequest.returnUrl}";

                var signature = CreateHmacSignature(dataStr, checksumKey);

                var fullRequest = new
                {
                    payosRequest.orderCode,
                    payosRequest.amount,
                    payosRequest.description,
                    payosRequest.cancelUrl,
                    payosRequest.returnUrl,
                    signature,
                    payosRequest.items,
                    payosRequest.buyerName,
                    payosRequest.buyerEmail,
                    payosRequest.buyerPhone,
                    payosRequest.buyerAddress
                };

                var json = JsonSerializer.Serialize(fullRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(_configuration["Payos:ApiUrl"], content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Payment creation failed: {responseContent}");
                    throw new Exception($"Payment creation failed: {responseContent}");
                }

                var paymentResponse = JsonSerializer.Deserialize<PaymentResponse>(responseContent);
                if (paymentResponse == null)
                {
                    throw new Exception("Failed to deserialize payment response");
                }

                // Create payment record in database
                await _paymentService.AddPaymentAsync(new Payment
                {
                    OrderId = orderId,
                    Amount = amount,
                    PaymentDate = DateTime.Now,
                    PaymentStatus = "Pending"
                });

                return paymentResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Payment request failed: {ex.Message}");
                throw;
            }
        }

        private string CreateHmacSignature(string data, string key)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key ?? throw new ArgumentNullException(nameof(key)));
            var messageBytes = Encoding.UTF8.GetBytes(data);

            using (var hmac = new HMACSHA256(keyBytes))
            {
                var hashBytes = hmac.ComputeHash(messageBytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }

        public async Task HandleWebhook(PayosWebhookPayload payload, string signature)
        {
            try
            {
                if (payload.Data == null)
                {
                    throw new ArgumentException("Webhook payload data is null");
                }

                if (string.IsNullOrEmpty(payload.Data.OrderCode))
                {
                    throw new ArgumentException("Order code is missing in webhook data");
                }

                if (string.IsNullOrEmpty(payload.Data.TransactionDateTime))
                {
                    throw new ArgumentException("Transaction date time is missing in webhook data");
                }

                if (!VerifyWebhookSignature(payload, signature))
                {
                    _logger.LogWarning("Invalid webhook signature received");
                    throw new Exception("Invalid webhook signature");
                }

                var orderCode = int.Parse(payload.Data.OrderCode);
                var amount = payload.Data.Amount;
                var status = payload.Code == "00" ? "PAID" : "FAILED";
                var transactionDateTime = DateTime.Parse(payload.Data.TransactionDateTime);

                var payment = await _paymentService.GetPaymentByOrderIdAsync(orderCode);
                if (payment == null)
                {
                    _logger.LogWarning($"Payment not found for order {orderCode}");
                    throw new Exception($"Payment not found for order {orderCode}");
                }

                payment.PaymentStatus = status;
                payment.PaymentDate = transactionDateTime;
                await _paymentService.UpdatePaymentAsync(payment);

                await _paymentService.AddPaymentHistoryAsync(new PaymentHistory
                {
                    PaymentId = payment.PaymentId,
                    PaymentDate = transactionDateTime,
                    Amount = amount,
                    PaymentStatus = status
                });

                _logger.LogInformation($"Webhook processed successfully for order {orderCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to process webhook: {ex.Message}");
                throw;
            }
        }

        private bool VerifyWebhookSignature(PayosWebhookPayload payload, string signature)
        {
            return payload.Signature == signature;
        }
    }

    public class PayosConfig
    {
        public string? ClientId { get; set; }
        public string? ApiKey { get; set; }
        public string? ChecksumKey { get; set; }
        public string? ApiUrl { get; set; }
        public string? ReturnUrl { get; set; }
        public string? CancelUrl { get; set; }
        public string? WebhookUrl { get; set; }
    }

    public class PaymentResponse
    {
        public string? Code { get; set; }
        public string? Desc { get; set; }
        public PaymentData? Data { get; set; }
    }

    public class PaymentData
    {
        public string? CheckoutUrl { get; set; }
        public string? QrCode { get; set; }
        public string? PaymentLinkId { get; set; }
    }

    public class PayosWebhookPayload
    {
        public string? Code { get; set; }
        public string? Desc { get; set; }
        public PayosWebhookData? Data { get; set; }
        public string? Signature { get; set; }
    }

    public class PayosWebhookData
    {
        public string? OrderCode { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public string? AccountNumber { get; set; }
        public string? Reference { get; set; }
        public string? TransactionDateTime { get; set; }
        public string? PaymentLinkId { get; set; }
        public string? Code { get; set; }
        public string? Desc { get; set; }
        public string? CounterAccountBankId { get; set; }
        public string? CounterAccountBankName { get; set; }
        public string? CounterAccountName { get; set; }
        public string? CounterAccountNumber { get; set; }
        public string? VirtualAccountName { get; set; }
        public string? VirtualAccountNumber { get; set; }
        public string? Currency { get; set; }
    }
} 