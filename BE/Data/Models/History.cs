using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("History")]
public class History
{
    public int HistoryId { get; set; }  // Đổi từ Id thành HistoryId

    public string TrackingCode { get; set; } = string.Empty;

    public string Shipper { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending"; // Mặc định là đang xác nhận

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
