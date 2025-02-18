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
    }
}
