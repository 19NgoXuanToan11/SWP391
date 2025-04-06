using Azure;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;
using Service;
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
        private readonly IPromotionService _promotionService;

        public PaymentController(PayOS payOS, IOrderService orderService, IPaymentService paymentService, IHistoryService historyService, IProductService productService, IPromotionService promotionService)
        {
            _payOS = payOS;
            _orderService = orderService;
            _paymentService = paymentService;
            _historyService = historyService;
            _productService = productService;
            _promotionService = promotionService;
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

        [HttpPost("create")]
        public async Task<IActionResult> CreatePaymentLink([FromBody] CreatePaymentLinkRequest body)
        {
            try
            {
                // Lấy thông tin đơn hàng
                var order = await _orderService.GetOrderByIdAsync(body.OrderId);
                if (order == null)
                {
                    return Ok(new Response(-1, "Order not found", null));
                }

                var oldPayment = await _paymentService.GetPaymentByOrderIdAsync(order.OrderId);
                if (oldPayment != null)
                {
                    return Ok(new Response(0, "Payment link already created", oldPayment));
                }

                // Lấy khuyến mãi áp dụng cho đơn hàng (nếu có)
                var promotion = await _promotionService.GetActivePromotionAsync();

                var cancelUrl = "http://localhost:5173/cart";
                var returnUrl = "http://localhost:5173/order-success";
                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

                // Tính tổng tiền đơn hàng
                decimal total = 0;
                List<Net.payOS.Types.ItemData> items = new List<Net.payOS.Types.ItemData>();

                // Duyệt qua các chi tiết đơn hàng để tính tổng tiền
                foreach (var cartItem in order.OrderDetails)
                {
                    total += cartItem.Quantity * cartItem.Price;
                    Net.payOS.Types.ItemData item = new(cartItem.Product.ProductName, cartItem.Quantity, (int)Math.Ceiling(cartItem.Price));
                    items.Add(item);
                }

                // Áp dụng khuyến mãi cho tổng tiền nếu có
                if (promotion != null && promotion.DiscountPercentage.HasValue)
                {
                    decimal discount = promotion.DiscountPercentage.Value / 100;
                    total = total * (1 - discount); // Áp dụng giảm giá cho tổng tiền
                }

                int finalTotal = (int)Math.Ceiling(total); // Đảm bảo tổng tiền là số nguyên

                // Tạo dữ liệu thanh toán cho PayOS
                PaymentData paymentData = new PaymentData(orderCode, (int)total, $"{order.OrderId}", items, cancelUrl, returnUrl);
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

        // API xử lý webhook từ PayOS
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

                    // Cập nhật trạng thái đơn hàng
                    order.Status = "Paid";
                    await _orderService.UpdateOrderAsync(order);

                    // Trừ stock cho các sản phẩm trong đơn hàng
                    foreach (var orderDetail in order.OrderDetails)
                    {
                        await _productService.UpdateProductStockAsync(orderDetail.ProductId, orderDetail.Quantity);
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
    }
}
