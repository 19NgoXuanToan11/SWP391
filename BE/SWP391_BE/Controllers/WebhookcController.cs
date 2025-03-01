using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("webhook")]
    public class WebhookController : ControllerBase
    {
        private readonly ILogger<WebhookController> _logger;
        private readonly IConfiguration _configuration;

        public WebhookController(ILogger<WebhookController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        // ✅ API xác nhận Webhook trên PayOS
        [HttpPost]
        public IActionResult ConfirmWebhook()
        {
            _logger.LogInformation(" Webhook confirmed successfully.");
            return Ok(new { message = "Webhook is active" });
        }

        // ✅ API xử lý khi có thanh toán từ PayOS
        [HttpPost("payos")]
        public async Task<IActionResult> ReceivePayOSWebhook(
            [FromBody] JsonElement payload,
            [FromHeader(Name = "x-signature")] string receivedSignature)
        {
            _logger.LogInformation("PayOS Webhook Received!");
            _logger.LogInformation("Signature: {signature}", receivedSignature);
            _logger.LogInformation("Payload: {payload}", JsonSerializer.Serialize(payload));

            if (string.IsNullOrEmpty(receivedSignature))
            {
                _logger.LogError("Missing x-signature header");
                return BadRequest(new { error = "Missing signature" });
            }

            // ✅ Xác minh chữ ký HMAC_SHA256
            string computedSignature = ComputeHmacSignature(payload);
            if (!computedSignature.Equals(receivedSignature, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogError(" Invalid signature!");
                return BadRequest(new { error = "Invalid signature" });
            }

            return Ok(new { message = "Webhook processed successfully" });
        }


        private string ComputeHmacSignature(JsonElement payload)
        {
            string key = _configuration["Payos:ChecksumKey"];
            string payloadJson = JsonSerializer.Serialize(payload);

            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payloadJson));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }
}
