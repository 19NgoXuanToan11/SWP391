namespace Data.Models
{
    public class PaymentResponse
    {
        public string Code { get; set; } = string.Empty;
        public string Desc { get; set; } = string.Empty;
        public PaymentData? Data { get; set; } // Cho phép null
        public string Signature { get; set; } = string.Empty;
    }

    public class PaymentData
    {
        public string PaymentUrl { get; set; } = string.Empty;
        public string PaymentLinkId { get; set; } = string.Empty;
    }

    public class PayosWebhookPayload
    {
        public string Code { get; set; } = string.Empty;
        public string Desc { get; set; } = string.Empty;
        public PayosWebhookData? Data { get; set; } // Cho phép null
    }

    public class PayosWebhookData
    {
        public string OrderCode { get; set; } = string.Empty;
        public decimal Amount { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
        public string PaymentLinkId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty; // Đã sửa để tránh xung đột tên
        public string TransactionDateTime { get; set; } = string.Empty;
    }
}