using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Payment")]
public partial class Payment
{
    public int PaymentId { get; set; }

    public int OrderId { get; set; }

    public DateTime? PaymentDate { get; set; }

    public decimal? Amount { get; set; }

    public string? PaymentStatus { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ICollection<PaymentHistory> PaymentHistories { get; set; } = new List<PaymentHistory>();
}
