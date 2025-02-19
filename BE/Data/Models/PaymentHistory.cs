using System;
using System.Collections.Generic;

namespace Data.Models;

public partial class PaymentHistory
{
    public int HistoryId { get; set; }

    public int PaymentId { get; set; }

    public DateTime? PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public string PaymentStatus { get; set; } = null!;

    public virtual Payment Payment { get; set; } = null!;
}
