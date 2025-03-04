using Microsoft.AspNetCore.Mvc;
using Service;
using System.Threading.Tasks;

namespace SWP391_BE.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly IPayosService _payosService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CheckoutController(IPayosService payosService, IHttpContextAccessor httpContextAccessor)
        {
            _payosService = payosService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("/")]
        public IActionResult Index()
        {
            return View("index");
        }

        [HttpGet("/cancel")]
        public IActionResult Cancel()
        {
            return View("cancel");
        }

        [HttpGet("/success")]
        public IActionResult Success()
        {
            return View("success");
        }

        [HttpPost("/create-payment-link")]
        public async Task<IActionResult> Checkout()
        {
            try
            {
                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
                var paymentResponse = await _payosService.CreatePaymentRequest(
                    orderCode,
                    2000, // amount in VND
                    "Thanh toan don hang",
                    "Nguyen Van A",
                    "nguyenvana@example.com",
                    "0909123456",
                    "123 Đường ABC, Quận 1, TP.HCM"
                );

                if (paymentResponse.Code == "00" && paymentResponse.Data?.PaymentUrl != null)
                {
                    return Redirect(paymentResponse.Data.PaymentUrl);
                }
                return Redirect("/");
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return Redirect("/");
            }
        }
    }
}