using Data.Models;
using Repo;

namespace Service
{
    public class DashboardReportService : IDashboardReportService
    {
        private readonly IDashboardReportRepository _dashboardReportRepository;

        public DashboardReportService(IDashboardReportRepository dashboardReportRepository)
        {
            _dashboardReportRepository = dashboardReportRepository;
        }

        public async Task<IEnumerable<DashboardReport>> GetAllDashboardReportsAsync()
        {
            return await _dashboardReportRepository.GetAllAsync();
        }

        public async Task<DashboardReport?> GetDashboardReportByIdAsync(int id)
        {
            return await _dashboardReportRepository.GetByIdAsync(id);
        }

        public async Task AddDashboardReportAsync(DashboardReport dashboardReport)
        {
            await _dashboardReportRepository.AddAsync(dashboardReport);
        }

        public async Task UpdateDashboardReportAsync(DashboardReport dashboardReport)
        {
            await _dashboardReportRepository.UpdateAsync(dashboardReport);
        }

        public async Task DeleteDashboardReportAsync(int id)
        {
            await _dashboardReportRepository.DeleteAsync(id);
        }
    }
}
