namespace Data.Models
{
    public class PaymentResponse
    {
        public string Code { get; set; }
        public string Desc { get; set; }
        public PaymentData Data { get; set; }
        public string Signature { get; set; }
    }

    public class PaymentData
    {
        public string PaymentUrl { get; set; }
        public string PaymentLinkId { get; set; }
    }
}
