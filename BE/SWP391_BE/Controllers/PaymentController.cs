using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Service;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("")]
public class PaymentController : ControllerBase
{
    private readonly PayosService _payosService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(PayosService payosService, ILogger<PaymentController> logger)
    {
        _payosService = payosService;
        _logger = logger;
    }

    [HttpPost("create-payment")]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        try 
        {
            _logger.LogInformation($"Creating payment for order {request.OrderId} with amount {request.Amount}");
            
            var response = await _payosService.CreatePaymentRequest(
                request.OrderId,
                request.Amount,
                request.Description
            );
            
            _logger.LogInformation($"Payment created successfully: {response}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Payment creation error: {ex}");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // Endpoint test đơn giản
    [HttpGet("test")]
    public IActionResult Test()
    {
        _logger.LogInformation("Test endpoint called");
        return Ok(new { message = "Webhook endpoint is working!" });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> HandleWebhook()
    {
        try
        {
            _logger.LogInformation("Webhook received at: {time}", DateTime.Now);

            // Log headers
            string signature = Request.Headers["X-Payos-Signature"].ToString();
            _logger.LogInformation($"Signature: {signature}");

            // Read body
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();
            _logger.LogInformation($"Webhook body: {body}");

            // Deserialize payload
            var payload = JsonSerializer.Deserialize<PayosWebhookPayload>(body);
            if (payload == null)
            {
                throw new Exception("Invalid webhook payload");
            }

            // Process webhook
            await _payosService.HandleWebhook(payload, signature);

            return Ok(new { message = "Webhook processed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Webhook error: {ex}");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("payment/return")]
    public IActionResult PaymentReturn([FromQuery] string orderCode, [FromQuery] string status)
    {
        _logger.LogInformation($"Payment return for order {orderCode} with status {status}");
        // Redirect to frontend with status
        return Redirect($"your-frontend-url/payment-result?orderCode={orderCode}&status={status}");
    }

    [HttpGet("payment/cancel")]
    public IActionResult PaymentCancel()
    {
        _logger.LogInformation("Payment cancelled");
        // Redirect to frontend cancel page
        return Redirect("your-frontend-url/payment-cancelled");
    }

    [HttpGet("payment/{paymentLinkId}")]
    public async Task<IActionResult> GetPaymentInfo(string paymentLinkId)
    {
        try
        {
            _logger.LogInformation($"Getting payment info for {paymentLinkId}");
            var response = await _payosService.GetPaymentRequestInfo(paymentLinkId);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Get payment info error: {ex}");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("payment/{paymentLinkId}/cancel")]
    public async Task<IActionResult> CancelPayment(string paymentLinkId)
    {
        try
        {
            _logger.LogInformation($"Cancelling payment {paymentLinkId}");
            var response = await _payosService.CancelPaymentRequest(paymentLinkId);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Cancel payment error: {ex}");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("confirm-webhook")]
    public async Task<IActionResult> ConfirmWebhook()
    {
        try
        {
            _logger.LogInformation("Confirming webhook URL");
            var success = await _payosService.ConfirmWebhook();
            
            if (success)
            {
                return Ok(new { message = "Webhook confirmed successfully" });
            }
            else
            {
                return BadRequest(new { error = "Failed to confirm webhook" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Confirm webhook error: {ex}");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class CreatePaymentRequest
{
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
} 