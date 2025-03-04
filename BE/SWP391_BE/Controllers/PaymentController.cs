using Microsoft.AspNetCore.Mvc;
using Net.payOS.Types;
using Service;

namespace SWP391_BE.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPayosService _payosService;

        public PaymentController(IPayosService payosService)
        {
            _payosService = payosService;
        }

        [HttpPost("payos_transfer_handler")]
        public async Task<IActionResult> PayosTransferHandler([FromBody] WebhookType body)
        {
            try
            {
                await _payosService.HandleWebhook(body);

                if (body.webhookDataType.description == "Ma giao dich thu nghiem" || body.webhookDataType.description == "VQRIO123")
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