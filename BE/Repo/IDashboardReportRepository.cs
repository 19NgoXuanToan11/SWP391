using Data.Models;

namespace Repo
{
    public interface IDashboardReportRepository
    {
        Task<IEnumerable<DashboardReport>> GetAllAsync();
        Task<DashboardReport?> GetByIdAsync(int id);
        Task AddAsync(DashboardReport dashboardReport);
        Task UpdateAsync(DashboardReport dashboardReport);
        Task DeleteAsync(int id);
        Task<DashboardReport> GetLatestDashboardReportAsync(string timeRange);
        Task<DashboardReport> GetDashboardReportByIdAsync(int id);
        Task<IEnumerable<DashboardReport>> GetDashboardReportHistoryAsync(DateTime startDate, DateTime endDate);
        Task UpdateDashboardReportAsync(DashboardReport report);
        Task CreateDashboardReportAsync(DashboardReport report);
        Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate);
        Task<int> GetTotalOrdersAsync(DateTime startDate, DateTime endDate);
        Task<int> GetActiveUsersCountAsync();
        Task<decimal> CalculateGrowthRateAsync(decimal currentValue, decimal previousValue);
    }
}
