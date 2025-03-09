using System.Text.Json.Serialization;

namespace Data.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // Thêm thuộc tính Status
        public string BuyerName { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerPhone { get; set; }
        public string BuyerAddress { get; set; }
        public string PaymentUrl { get; set; }
        public DateTime CreatedDate { get; set; }

        public int? OrderCode { get; set; }

        // Mối quan hệ với Order
        [JsonIgnore]
        public virtual Order Order { get; set; }

        // Mối quan hệ với PaymentHistory
          [JsonIgnore] 
        public virtual ICollection<PaymentHistory> PaymentHistories { get; set; }
    }
}