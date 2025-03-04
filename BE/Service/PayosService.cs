using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Net.payOS;
using Net.payOS.Types;
using Data.Models;
using Repo;

namespace Service
{
    public interface IPayosService
    {
        Task<PaymentResponse> CreatePaymentRequest(int orderId, decimal amount, string? description, string? buyerName, string? buyerEmail, string? buyerPhone, string? buyerAddress);
        Task<PaymentResponse> GetPaymentRequestInfo(string paymentId);
        Task<PaymentResponse> CancelPaymentRequest(string paymentId, string cancellationReason);
        Task HandleWebhook(WebhookType body);
        Task<bool> ConfirmWebhookAsync(string webhookUrl);
    }

    public class PayosService : IPayosService
    {
        private readonly PayOS _payOS;
        private readonly IPaymentRepository _paymentRepository;
        private readonly ILogger<PayosService> _logger;
        private readonly IConfiguration _configuration;

        public PayosService(PayOS payOS, IConfiguration configuration, ILogger<PayosService> logger, IPaymentRepository paymentRepository)
        {
            _payOS = payOS ?? throw new ArgumentNullException(nameof(payOS));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _paymentRepository = paymentRepository ?? throw new ArgumentNullException(nameof(paymentRepository));

            _logger.LogDebug($"Payos:ClientId: {_configuration["Payos:ClientId"] ?? "Missing"}");
            _logger.LogDebug($"Payos:ApiKey: {_configuration["Payos:ApiKey"] ?? "Missing"}");
            _logger.LogDebug($"Payos:ChecksumKey: {_configuration["Payos:ChecksumKey"] ?? "Missing"}");
        }

        public async Task<PaymentResponse> CreatePaymentRequest(int orderId, decimal amount, string? description, string? buyerName, string? buyerEmail, string? buyerPhone, string? buyerAddress)
        {
            try
            {
                var items = new List<ItemData> { new ItemData(description ?? "Product", 1, (int)(amount * 100)) };
                var paymentData = new PaymentData(
                    orderCode: orderId,
                    amount: (int)(amount * 100),
                    description: description ?? "Thanh toán đơn hàng",
                    items: items,
                    cancelUrl: _configuration["Payos:CancelUrl"] ?? throw new ArgumentNullException("Payos:CancelUrl"),
                    returnUrl: _configuration["Payos:ReturnUrl"] ?? throw new ArgumentNullException("Payos:ReturnUrl")
                );

                _logger.LogInformation($"Request PaymentData: {Net.payOS.Utils.Json.Serialize(paymentData)}");

                var createPayment = await _payOS.createPaymentLink(paymentData);
                _logger.LogInformation($"CreatePaymentResult: {Net.payOS.Utils.Json.Serialize(createPayment)}");

                var paymentResponse = new PaymentResponse
                {
                    Code = "00",
                    Desc = "Success - Thành công",
                    Data = new PaymentData
                    {
                        PaymentUrl = createPayment.checkoutUrl,
                        OrderCode = createPayment.orderCode.ToString(),
                        Amount = (decimal)createPayment.amount / 100,
                        PaymentLinkId = createPayment.paymentLinkId
                    },
                    Signature = createPayment.signature // Lấy signature từ SDK
                };

                if (!string.IsNullOrEmpty(paymentResponse.Data?.PaymentUrl))
                {
                    var payment = new Payment
                    {
                        OrderId = orderId,
                        Amount = amount,
                        BuyerName = buyerName ?? string.Empty,
                        BuyerEmail = buyerEmail ?? string.Empty,
                        BuyerPhone = buyerPhone ?? string.Empty,
                        BuyerAddress = buyerAddress ?? string.Empty,
                        PaymentUrl = paymentResponse.Data.PaymentUrl,
                        PaymentStatus = "Pending",
                        CreatedDate = DateTime.Now,
                        PaymentDate = DateTime.Now
                    };
                    await _paymentRepository.AddAsync(payment);
                }

                return paymentResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating payment: {ex.Message}");
                throw;
            }
        }

        public async Task<PaymentResponse> GetPaymentRequestInfo(string paymentId)
        {
            try
            {
                var paymentLinkInfo = await _payOS.getPaymentLinkInformation(long.Parse(paymentId));
                _logger.LogInformation($"PaymentLinkInfo: {Net.payOS.Utils.Json.Serialize(paymentLinkInfo)}");

                var paymentResponse = new PaymentResponse
                {
                    Code = "00",
                    Desc = "Success - Thành công",
                    Data = new PaymentData
                    {
                        OrderCode = paymentLinkInfo.orderCode.ToString(),
                        Amount = (decimal)paymentLinkInfo.amount / 100,
                        PaymentLinkId = paymentLinkInfo.id
                    },
                    Signature = "" // Không cần signature cho get
                };

                return paymentResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching payment info: {ex.Message}");
                throw;
            }
        }

        public async Task<PaymentResponse> CancelPaymentRequest(string paymentId, string cancellationReason)
        {
            try
            {
                var paymentLinkInfo = await _payOS.cancelPaymentLink(long.Parse(paymentId), cancellationReason);
                _logger.LogInformation($"Cancelled PaymentLinkInfo: {Net.payOS.Utils.Json.Serialize(paymentLinkInfo)}");

                var paymentResponse = new PaymentResponse
                {
                    Code = "00",
                    Desc = "Success - Thành công",
                    Data = new PaymentData
                    {
                        OrderCode = paymentLinkInfo.orderCode.ToString(),
                        Amount = (decimal)paymentLinkInfo.amount / 100,
                        PaymentLinkId = paymentLinkInfo.id
                    },
                    Signature = "" // Không cần signature cho cancel
                };

                return paymentResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error canceling payment: {ex.Message}");
                throw;
            }
        }

        public async Task HandleWebhook(WebhookType body)
        {
            try
            {
                _logger.LogInformation($"Received Webhook from PayOS: {Net.payOS.Utils.Json.Serialize(body)}");

                var webhookData = _payOS.verifyPaymentWebhookData(body);
                _logger.LogInformation($"Verified WebhookData: {Net.payOS.Utils.Json.Serialize(webhookData)}");

                if (webhookData.description == "Ma giao dich thu nghiem" || webhookData.description == "VQRIO123")
                {
                    _logger.LogInformation("Webhook verified successfully (test transaction)!");
                }
                else
                {
                    _logger.LogInformation("Webhook verified successfully!");
                }
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing Webhook: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> ConfirmWebhookAsync(string webhookUrl)
        {
            try
            {
                _logger.LogDebug($"Confirming Webhook with URL: {webhookUrl}");
                await _payOS.confirmWebhook(webhookUrl);
                _logger.LogInformation("Webhook confirmed successfully!");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error confirming webhook: {ex.Message}");
                throw;
            }
        }
    }

    public class PaymentResponse
    {
        public string Code { get; set; } = string.Empty;
        public string Desc { get; set; } = string.Empty;
        public PaymentData? Data { get; set; }
        public string Signature { get; set; } = string.Empty;
    }

    public class PaymentData
    {
        public string? PaymentUrl { get; set; }
        public string? OrderCode { get; set; }
        public decimal? Amount { get; set; }
        public string? PaymentLinkId { get; set; }
    }
}