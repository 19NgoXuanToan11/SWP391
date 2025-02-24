namespace SWP391_BE.DTOs
{
    public class DashboardStatisticsDTO
    {
        public decimal TotalSales { get; set; }
        public decimal SalesGrowth { get; set; }
        public int TotalOrders { get; set; }
        public decimal OrdersGrowth { get; set; }
        public int ActiveUsers { get; set; }
        public decimal UserGrowth { get; set; }
        public decimal OverallGrowth { get; set; }
        public string? RevenueData { get; set; }
        public string? OrdersData { get; set; }
        public DateTime LastUpdated { get; set; }
        public string? TimeRange { get; set; }
    }
} 