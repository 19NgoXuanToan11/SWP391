using Azure;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;
using Service;
using SWP391_BE.DTOs;
using System.Collections;
using System.Net.NetworkInformation;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SWP391_BE.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PayOS _payOS;
        private readonly IOrderService _orderService;
        private readonly IPaymentService _paymentService;
        public PaymentController(PayOS payOS, IOrderService orderService, IPaymentService paymentService)
        {
            _payOS = payOS;
            _orderService = orderService;
            _paymentService = paymentService;
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



                PaymentData paymentData = new PaymentData(orderCode, total, $"Mã đơn hàng:{order.OrderId}", items, cancelUrl, returnUrl);

                CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);

                var paymen = new Payment
                {
                    OrderId = order.OrderId,
                    CreatedDate = DateTime.Now,
                    Amount = total,
                    Status = "PENDING",
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
        private int? ExtractOrderIdFromDescription(string description)
        {
            try
            {
                // Tách chuỗi theo dấu ":" => ["Mã đơn hàng", "12345"]
                var parts = description.Split(':');
                if (parts.Length < 2)
                {
                    return null;
                }

                // Lấy phần số, loại bỏ khoảng trắng thừa
                if (int.TryParse(parts[1].Trim(), out int orderId))
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