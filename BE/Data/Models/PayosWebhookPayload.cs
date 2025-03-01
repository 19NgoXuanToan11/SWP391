namespace Data.Models
{
    public class PayosWebhookPayload
    {
        public string Code { get; set; }
        public string Desc { get; set; }
        public PayosWebhookData Data { get; set; }
    }

    public class PayosWebhookData
    {
        public string OrderCode { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string PaymentLinkId { get; set; }
        public string Code { get; set; }  // ✅ Đã thêm Code để fix lỗi
        public string TransactionDateTime { get; set; }
    }
}
