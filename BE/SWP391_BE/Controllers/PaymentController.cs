using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IPayosService _payosService;

    public PaymentController(IPayosService payosService)
    {
        _payosService = payosService;
    }

    [HttpPost("create-payment")]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            var response = await _payosService.CreatePaymentRequest(
                request.OrderId,
                request.Amount,
                request.Description,
                request.BuyerName,
                request.BuyerEmail,
                request.BuyerPhone,
                request.BuyerAddress
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class CreatePaymentRequest
{
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public string BuyerName { get; set; }
    public string BuyerEmail { get; set; }
    public string BuyerPhone { get; set; }
    public string BuyerAddress { get; set; }
}
