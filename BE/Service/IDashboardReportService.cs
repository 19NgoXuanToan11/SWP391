using Data.Models;

namespace Service
{
    public interface IDashboardReportService
    {
        Task<IEnumerable<DashboardReport>> GetAllDashboardReportsAsync();
        Task<DashboardReport?> GetDashboardReportByIdAsync(int id);
        Task AddDashboardReportAsync(DashboardReport dashboardReport);
        Task UpdateDashboardReportAsync(DashboardReport dashboardReport);
        Task DeleteDashboardReportAsync(int id);
        Task<DashboardReport> GetDashboardStatisticsAsync(string timeRange);
        Task<IEnumerable<DashboardReport>> GetDashboardHistoryAsync(DateTime startDate, DateTime endDate);
        Task UpdateDashboardStatisticsAsync(string timeRange);
        Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate);
        Task<int> GetTotalOrdersAsync(DateTime startDate, DateTime endDate);
        Task<int> GetActiveUsersCountAsync();
        Task<decimal> CalculateGrowthRateAsync(decimal currentValue, decimal previousValue);
    }
}
