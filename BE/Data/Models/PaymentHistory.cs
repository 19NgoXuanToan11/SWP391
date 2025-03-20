namespace Data.Models
{
    public class PaymentHistory
    {
        public int HistoryId { get; set; }
        public int PaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; } // Thêm thuộc tính TransactionId

        // Mối quan hệ với Payment
        public virtual Payment Payment { get; set; }
    }
}