using Azure;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using Net.payOS;
using Net.payOS.Types;
using Service;
using SWP391_BE.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public PaymentController(PayOS payOS, IOrderService orderService, IPaymentService paymentService, IHistoryService historyService, IProductService productService)
        {
            _payOS = payOS;
            _orderService = orderService;
            _paymentService = paymentService;
            _historyService = historyService;
            _productService = productService;
        }

        public record ConfirmWebhook(string webhook_url);

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

        public record Response(int error, string message, object? data);

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

                var oldPayment = await _paymentService.GetPaymentByOrderIdAsync(order.OrderId);
                if (oldPayment != null)
                {
                    return Ok(new Response(0, "success", oldPayment));
                }

                var cancelUrl = "http://localhost:5173/cart";
                var returnUrl = "http://localhost:5173/order-success";
                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

                // Tính tổng tiền sau khi áp dụng promotion
                decimal total = 0;
                List<ItemData> items = new List<ItemData>();
                foreach (var cartItem in order.OrderDetails)
                {
                    decimal discountedPrice = await GetDiscountedPrice(cartItem); // Lấy giá sau khi áp dụng promotion
                    total += cartItem.Quantity * discountedPrice;
                    ItemData item = new ItemData(cartItem.Product.ProductName, cartItem.Quantity, (int)Math.Ceiling(discountedPrice));
                    items.Add(item);
                }

                int finalTotal = (int)Math.Ceiling(total); // Đảm bảo tổng tiền là số nguyên

                PaymentData paymentData = new PaymentData(orderCode, finalTotal, $"{order.OrderId}", items, cancelUrl, returnUrl);
                CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);

                var payment = new Payment
                {
                    OrderId = order.OrderId,
                    CreatedDate = DateTime.Now,
                    Amount = finalTotal,
                    Status = createPayment.status,
                    BuyerName = body.BuyerName,
                    BuyerAddress = body.BuyerAddress,
                    BuyerEmail = body.BuyerEmail,
                    BuyerPhone = body.BuyerPhone,
                    PaymentUrl = createPayment.checkoutUrl,
                    OrderCode = orderCode
                };

                await _paymentService.AddPaymentAsync(payment);

                return Ok(new Response(0, "success", payment));
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "fail", null));
            }
        }

        [HttpPost("ipn")]
        public async Task<IActionResult> PayOSTransferHandler([FromBody] WebhookType body)
        {
            try
            {
                WebhookData data = _payOS.verifyPaymentWebhookData(body);

                Console.WriteLine($"Description: {data.description}");
                Console.WriteLine($"Code: {data.code}");

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

                    var payment = await _paymentService.GetPaymentByOrderIdAsync(orderId.Value);
                    if (payment == null)
                    {
                        return Ok(new Response(-1, "fail", null));
                    }

                    payment.Status = "PAID";
                    payment.PaymentDate = DateTime.Now;
                    await _paymentService.UpdatePaymentAsync(payment);

                    var order = await _orderService.GetOrderByIdAsync(orderId.Value);
                    if (order == null)
                    {
                        return Ok(new Response(-1, "Order not found", null));
                    }

                    order.Status = "Paid";
                    await _orderService.UpdateOrderAsync(order);

                    foreach (var orderDetail in order.OrderDetails)
                    {
                        await _productService.UpdateProductStockAsync(orderDetail.ProductId, orderDetail.Quantity);
                    }

                    var history = new History
                    {
                        TrackingCode = GenerateTrackingCode(),
                        Shipper = "Nguyen Van A",
                        Status = "COMPLETED",
                        OrderDetails = order.OrderDetails
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

        // Hàm tính giá sau khi áp dụng promotion
        private async Task<decimal> GetDiscountedPrice(OrderDetail cartItem)
        {
            // Giả định: Promotion được lưu trong Order hoặc OrderDetail
            // Bạn cần thay logic này bằng cách lấy thông tin thực tế từ hệ thống
            decimal originalPrice = cartItem.Price;

            // Ví dụ: Giảm 10% (thay bằng logic thực tế của bạn)
            decimal discountPercentage = 0.1m; // 10%
            decimal discountedPrice = originalPrice * (1 - discountPercentage);

            // Nếu có service để lấy promotion, bạn có thể làm như sau:
            // var promotion = await _promotionService.GetPromotionForProduct(cartItem.ProductId);
            // if (promotion != null)
            // {
            //     discountedPrice = originalPrice * (1 - promotion.DiscountPercentage);
            // }

            return discountedPrice;
        }
    }
}