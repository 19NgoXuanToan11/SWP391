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
    }
}
