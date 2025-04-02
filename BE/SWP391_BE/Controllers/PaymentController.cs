using Azure;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using Net.payOS;
using Net.payOS.Types;
using Service;
using SWP391_BE.DTOs;
using System.Collections;
using System.Net.NetworkInformation;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;

namespace SWP391_BE.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PayOS _payOS;
        private readonly IOrderService _orderService;
        private readonly IPaymentService _paymentService;
        private readonly IHistoryService _historyService;
        private readonly IProductService _productService;
        private readonly ILogger<PaymentController> _logger;
        public PaymentController(PayOS payOS, IOrderService orderService, IPaymentService paymentService, IHistoryService historyservice, IProductService productService, ILogger<PaymentController> logger)
        {
            _payOS = payOS;
            _orderService = orderService;
            _paymentService = paymentService;
            _historyService = historyservice;
            _productService = productService;
            _logger = logger;

        }
        public record ConfirmWebhook(
            string webhook_url
        );



        public class CreatePaymentLinkRequest
        {
            public string BuyerName { get; set; }
            public string BuyerEmail { get; set; }
            public string BuyerPhone { get; set; }
            public string BuyerAddress { get; set; }

            public int OrderId { get; set; }
            public int UserId { get; set; }
            public string PaymentMethod { get; set; }

        }

        public record Response(
            int error,
            string message,
            object? data
        );

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPayments()
        {
            try
            {
                var payments = await _paymentService.GetAllPaymentsAsync();
                if (payments == null || !payments.Any())
                {
                    return Ok(new Response(-1, "No payments found", null));
                }
                return Ok(new Response(0, "success", payments));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Get All Payments Error: {e.Message}");
                return Ok(new Response(-1, "fail", null));
            }
        }

        [HttpGet("orderCode/{orderCode}")]
        public async Task<IActionResult> GetPaymentByOrderCode(int orderCode)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByOrderCodeAsync(orderCode);
                if (payment == null)
                {
                    return Ok(new Response(-1, "Payment not found", null));
                }

                return Ok(new Response(0, "success", payment));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Get Payment Error: {e.Message}");
                return Ok(new Response(-1, "fail", null));
            }
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPaidPaymentsByUserId(int userId)
        {
            var payments = await _paymentService.GetPaidPaymentsByUserIdAsync(userId);
            if (!payments.Any())
            {
                return NotFound(new { message = "Không có đơn hàng đã thanh toán nào!" });
            }

            return Ok(payments.Select(payment => new
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                PaymentDate = payment.PaymentDate,
                Amount = payment.Amount,
                Status = payment.Status,
                Products = payment.Order.OrderDetails.Select(od => new
                {
                    ProductName = od.Product.ProductName,
                    ProductImages = od.Product.Images.Select(img => img.ImageUrl).ToList(),
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            }));
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePaymentLink([FromBody] CreatePaymentLinkRequest body)
        {
            try
            {


                var order = await _orderService.GetOrderByIdAsync(body.OrderId);
                if (order == null)
                {
                    return Ok(new Response(-1, "Order not found", null));
                }

                var odlPayment = await _paymentService.GetPaymentByOrderIdAsync(order.OrderId);
                if (odlPayment != null)
                {
                    return Ok(new Response(0, "success", odlPayment));
                }

                var cancelUrl = "http://localhost:5173/cart";
                var returnUrl = "http://localhost:5173/order-success";
                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

                int total = 0;
                List<ItemData> items = new List<ItemData>();
                order.OrderDetails.ToList().ForEach(cartItem =>
                {
                    total += (cartItem.Quantity * (int)Math.Ceiling(cartItem.Price));
                    ItemData item = new ItemData(cartItem.Product.ProductName, cartItem.Quantity, (int)Math.Ceiling(cartItem.Price));
                    items.Add(item);
                });



                PaymentData paymentData = new PaymentData(orderCode, total, $"{order.OrderId}", items, cancelUrl, returnUrl);

                CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);

                var paymen = new Payment
                {
                    OrderId = order.OrderId,
                    CreatedDate = DateTime.Now,
                    Amount = total,
                    Status = createPayment.status,
                    BuyerName = body.BuyerName,
                    BuyerAddress = body.BuyerAddress,
                    BuyerEmail = body.BuyerEmail,
                    BuyerPhone = body.BuyerPhone,
                    PaymentUrl = createPayment.checkoutUrl,
                    OrderCode = orderCode
                };

                await _paymentService.AddPaymentAsync(paymen);

                return Ok(new Response(0, "success", paymen));
            }
            catch (System.Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "fail", null));
            }
        }


        [HttpPost("ipn")]
        public async Task<IActionResult> payOSTransferHandler([FromBody] WebhookType body)
        {
            try
            {
                WebhookData data = _payOS.verifyPaymentWebhookData(body);

                Console.WriteLine($"Description: {data.description}");
                Console.WriteLine($"Description: {data.code}");
                // Kiểm tra mô tả giao dịch
                if (data.description == "Ma giao dich thu nghiem" || data.description == "VQRIO123")
                {
                    return Ok(new Response(0, "Ok", null));
                }

                if (data.code == "00")
                {
                    int? orderId = ExtractOrderIdFromDescription(data.description);
                    if (!orderId.HasValue)
                    {
                        return Ok(new Response(-1, "fail", null));
                    }

                    // Lấy thông tin thanh toán từ DB
                    var payment = await _paymentService.GetPaymentByOrderIdAsync(orderId.Value);
                    if (payment == null)
                    {
                        return Ok(new Response(-1, "fail", null));
                    }

                    // Cập nhật trạng thái thanh toán
                    payment.Status = "PAID";
                    payment.PaymentDate = DateTime.Now;

                    await _paymentService.UpdatePaymentAsync(payment);
                    var order = await _orderService.GetOrderByIdAsync(orderId.Value);
                    if (order == null)
                    {
                        return Ok(new Response(-1, "Order not found", null));
                    }

                    // Tạo và lưu bản ghi History
                    var history = new History
                    {
                        TrackingCode = GenerateTrackingCode(), // Tạo mã vận đơn ngẫu nhiên
                        Shipper = "Nguyen Van A", // Giả định tên shipper, có thể lấy từ IShipperService
                        Status = "COMPLETED", // Cập nhật status
                        OrderDetails = order.OrderDetails // Gán chi tiết đơn hàng
                    };

                    await _historyService.AddAsync(history);
                    return Ok(new Response(0, "Ok", null));
                }
                return Ok(new Response(0, "Ok", null));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Webhook Error: {e.Message}");
                return Ok(new Response(-1, "fail", null));
            }
        }
        private string GenerateTrackingCode()
        {
            return "TRK-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }
        private int? ExtractOrderIdFromDescription(string description)
        {
            try
            {

                // Lấy phần số, loại bỏ khoảng trắng thừa
                if (int.TryParse(description.Trim(), out int orderId))
                {
                    return orderId;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ExtractOrderIdFromDescription Error: {ex.Message}");
            }

            return null;
        }

        [HttpPost("payos-webhook")]
        public async Task<IActionResult> payOSTransferHandler([FromBody] PayOSWebhookDTO webhookData)
        {
            try
            {
                _logger.LogInformation("Received PayOS webhook: {WebhookData}", JsonConvert.SerializeObject(webhookData));
                
                var data = webhookData.data;
                if (data == null)
                {
                    _logger.LogWarning("PayOS webhook data is null");
                    return BadRequest("Invalid webhook data");
                }

                // Kiểm tra mã trạng thái thanh toán
                if (data.code == "00") // Mã thành công
                {
                    // Lấy orderId từ orderCode
                    string orderCode = data.orderCode;
                    int? orderId = null;
                    
                    if (!string.IsNullOrEmpty(orderCode) && orderCode.StartsWith("ORDER_"))
                    {
                        string orderIdStr = orderCode.Substring(6); // Bỏ tiền tố "ORDER_"
                        if (int.TryParse(orderIdStr, out int id))
                        {
                            orderId = id;
                        }
                    }

                    if (!orderId.HasValue)
                    {
                        _logger.LogWarning("Could not extract orderId from orderCode: {OrderCode}", orderCode);
                        return BadRequest("Invalid order code format");
                    }

                    // Cập nhật trạng thái đơn hàng thành "Paid"
                    var order = await _orderService.GetOrderByIdAsync(orderId.Value);
                    if (order == null)
                    {
                        _logger.LogWarning("Order not found with ID: {OrderId}", orderId.Value);
                        return NotFound($"Order not found with ID: {orderId.Value}");
                    }

                    // Cập nhật trạng thái đơn hàng
                    await _orderService.UpdateOrderStatusAsync(orderId.Value, "Paid");
                    
                    // Trừ stock cho từng sản phẩm trong đơn hàng
                    _logger.LogInformation("Bắt đầu cập nhật stock cho đơn hàng {OrderId}", orderId.Value);

                    foreach (var orderDetail in order.OrderDetails)
                    {
                        _logger.LogInformation("Cập nhật stock cho sản phẩm {ProductId}, số lượng cần giảm: {Quantity}", 
                            orderDetail.ProductId, orderDetail.Quantity);
                        
                        try {
                            // Đảm bảo gọi đúng phương thức và đợi nó hoàn thành
                            // orderDetail.Quantity là số lượng sản phẩm trong đơn hàng, cũng chính là số lượng stock cần giảm
                            await _productService.UpdateProductStockAsync(orderDetail.ProductId, orderDetail.Quantity);
                            _logger.LogInformation("Đã giảm thành công {Quantity} đơn vị stock cho sản phẩm {ProductId}", 
                                orderDetail.Quantity, orderDetail.ProductId);
                        }
                        catch (Exception ex) {
                            _logger.LogError(ex, "Lỗi khi giảm stock cho sản phẩm {ProductId}: {Message}", 
                                orderDetail.ProductId, ex.Message);
                            // Có thể xử lý lỗi ở đây, ví dụ: gửi thông báo cho admin
                        }
                    }

                    // Lưu thông tin thanh toán
                    var payment = new Payment
                    {
                        OrderId = orderId.Value,
                        Amount = data.amount,
                        PaymentDate = DateTime.Now,
                        PaymentMethod = "PayOS",
                        TransactionId = data.transactionId,
                        Status = "Completed"
                    };
                    
                    await _paymentService.AddPaymentAsync(payment);
                    
                    _logger.LogInformation("Payment processed successfully for order {OrderId}", orderId.Value);
                    return Ok(new { message = "Payment processed successfully" });
                }
                else
                {
                    _logger.LogWarning("Payment not successful. Code: {Code}, Message: {Message}", data.code, data.desc);
                    return Ok(new { message = "Payment not successful" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing PayOS webhook");
                return StatusCode(500, "An error occurred while processing the payment webhook");
            }
        }


    }
}