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
    public IActionResult HandleWebhook()
    {
        try
        {
            _logger.LogInformation("Webhook received at: {time}", DateTime.Now);

            // Log headers
            foreach (var header in Request.Headers)
            {
                _logger.LogInformation($"Header: {header.Key} = {header.Value}");
            }

            // Read and log body
            using var reader = new StreamReader(Request.Body);
            var body = reader.ReadToEndAsync().Result;
            _logger.LogInformation($"Webhook body: {body}");

            return Ok(new { message = "Webhook received" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Webhook error: {ex}");
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