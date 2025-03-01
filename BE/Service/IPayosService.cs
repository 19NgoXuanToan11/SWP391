using Data.Models;

public interface IPayosService
{

    Task<PaymentResponse> CreatePaymentRequest(int orderId, decimal amount, string description, string buyerName, string buyerEmail, string buyerPhone, string buyerAddress);
    Task<PaymentResponse> GetPaymentRequestInfo(string paymentId);
    Task<PaymentResponse> CancelPaymentRequest(string paymentId, string cancellationReason);
    Task HandleWebhook(PayosWebhookPayload payload, string receivedSignature);
    Task<bool> UpdateWebhookAsync();
    Task<bool> ConfirmWebhookAsync();
}
