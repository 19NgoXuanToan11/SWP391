using Azure;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;
using Service;

namespace SWP391_BE.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PayOS _payOS;
        public PaymentController(PayOS payOS)
        {
            _payOS = payOS;
        }
        public record ConfirmWebhook(
            string webhook_url
        );

        public class CartItem
        {
            public string ProductId { get; set; }
            public string ProductName { get; set; }
            public int Quantity { get; set; }
            public int Price { get; set; }
        }


        public class CreatePaymentLinkRequest
        {
            public List<CartItem> CartItems { get; set; } = new List<CartItem>();

        }
        /*public record CreatePaymentLinkRequest(
            Cart cart,
            string productName,
            string description,
            int price,
            string returnUrl,
            string cancelUrl
        );*/
        public record Response(
            int error,
            String message,
            object? data
        );

        [HttpPost("create")]
        public async Task<IActionResult> CreatePaymentLink([FromBody] CreatePaymentLinkRequest body)
        {
            try
            {
                var order = new Order
                {

                };
                var paymen = new Payment
                {

                };


                var cancelUrl = "cancel-url";
                var returnUrl = "return-url";
                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

                int total = 0;
                List<ItemData> items = new List<ItemData>();
                body.CartItems.ForEach(cartItem =>
                {
                    total += (cartItem.Quantity * cartItem.Price);
                    ItemData item = new ItemData(cartItem.ProductName, cartItem.Quantity, cartItem.Price);
                    items.Add(item);
                });


                PaymentData paymentData = new PaymentData(orderCode, total, "Description", items, cancelUrl, returnUrl);

                CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);

                return Ok(new Response(0, "success", createPayment));
            }
            catch (System.Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "fail", null));
            }
        }


        [HttpPost("ipn")]
        public IActionResult payOSTransferHandler(WebhookType body)
        {
            try
            {
                WebhookData data = _payOS.verifyPaymentWebhookData(body);

                if (data.description == "Ma giao dich thu nghiem" || data.description == "VQRIO123")
                {
                    return Ok(new Response(0, "Ok", null));
                }
                return Ok(new Response(0, "Ok", null));
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Ok(new Response(-1, "fail", null));
            }

        }

    }
}