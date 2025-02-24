using System;
using System.Collections.Generic;

namespace Data.Models;

public partial class DashboardReport
{
    public int ReportId { get; set; }
    public decimal TotalSales { get; set; }
    public decimal SalesGrowthRate { get; set; }
    public int TotalOrders { get; set; }
    public decimal OrdersGrowthRate { get; set; }
    public int ActiveUsers { get; set; }
    public decimal UserGrowthRate { get; set; }
    public decimal OverallGrowthRate { get; set; }
    public string? RevenueData { get; set; }
    public string? OrdersData { get; set; }
    public DateTime LastUpdated { get; set; }
    public string? TimeRange { get; set; } // e.g., "Last 7 days", "Last 30 days", "Last 90 days"
}
