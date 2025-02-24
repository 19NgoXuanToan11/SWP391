using Data.Models;
using Repo;
using System.Text.Json;

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

        public async Task<DashboardReport> GetDashboardStatisticsAsync(string timeRange)
        {
            var report = await _dashboardReportRepository.GetLatestDashboardReportAsync(timeRange);
            if (report == null || (DateTime.UtcNow - report.LastUpdated).TotalMinutes > 15)
            {
                await UpdateDashboardStatisticsAsync(timeRange);
                report = await _dashboardReportRepository.GetLatestDashboardReportAsync(timeRange);
            }
            return report;
        }

        public async Task<IEnumerable<DashboardReport>> GetDashboardHistoryAsync(DateTime startDate, DateTime endDate)
        {
            return await _dashboardReportRepository.GetDashboardReportHistoryAsync(startDate, endDate);
        }

        public async Task UpdateDashboardStatisticsAsync(string timeRange)
        {
            var now = DateTime.UtcNow;
            var startDate = timeRange switch
            {
                "Last 7 days" => now.AddDays(-7),
                "Last 30 days" => now.AddDays(-30),
                "Last 90 days" => now.AddDays(-90),
                _ => now.AddDays(-30) // Default to 30 days
            };

            var previousStartDate = startDate.AddDays(-(now - startDate).TotalDays);

            // Get current period metrics
            var currentSales = await GetTotalSalesAsync(startDate, now);
            var currentOrders = await GetTotalOrdersAsync(startDate, now);
            var activeUsers = await GetActiveUsersCountAsync();

            // Get previous period metrics for growth calculation
            var previousSales = await GetTotalSalesAsync(previousStartDate, startDate);
            var previousOrders = await GetTotalOrdersAsync(previousStartDate, startDate);
            var previousActiveUsers = await GetActiveUsersCountAsync(); // This might need adjustment based on your requirements

            // Calculate growth rates
            var salesGrowth = await CalculateGrowthRateAsync(currentSales, previousSales);
            var ordersGrowth = await CalculateGrowthRateAsync(currentOrders, previousOrders);
            var usersGrowth = await CalculateGrowthRateAsync(activeUsers, previousActiveUsers);

            var report = new DashboardReport
            {
                TotalSales = currentSales,
                SalesGrowthRate = salesGrowth,
                TotalOrders = currentOrders,
                OrdersGrowthRate = ordersGrowth,
                ActiveUsers = activeUsers,
                UserGrowthRate = usersGrowth,
                OverallGrowthRate = (salesGrowth + ordersGrowth + usersGrowth) / 3,
                LastUpdated = now,
                TimeRange = timeRange
            };

            await _dashboardReportRepository.CreateDashboardReportAsync(report);
        }

        public async Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate)
        {
            return await _dashboardReportRepository.GetTotalSalesAsync(startDate, endDate);
        }

        public async Task<int> GetTotalOrdersAsync(DateTime startDate, DateTime endDate)
        {
            return await _dashboardReportRepository.GetTotalOrdersAsync(startDate, endDate);
        }

        public async Task<int> GetActiveUsersCountAsync()
        {
            return await _dashboardReportRepository.GetActiveUsersCountAsync();
        }

        public async Task<decimal> CalculateGrowthRateAsync(decimal currentValue, decimal previousValue)
        {
            return await _dashboardReportRepository.CalculateGrowthRateAsync(currentValue, previousValue);
        }
    }
}
