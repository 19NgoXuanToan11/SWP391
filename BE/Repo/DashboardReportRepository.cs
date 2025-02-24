using Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Repo
{
    public class DashboardReportRepository : IDashboardReportRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public DashboardReportRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        // Basic CRUD Operations
        public async Task<IEnumerable<DashboardReport>> GetAllAsync()
        {
            return await _context.DashboardReports.ToListAsync();
        }

        public async Task<DashboardReport?> GetByIdAsync(int id)
        {
            return await _context.DashboardReports.FindAsync(id);
        }

        public async Task AddAsync(DashboardReport dashboardReport)
        {
            await _context.DashboardReports.AddAsync(dashboardReport);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(DashboardReport dashboardReport)
        {
            _context.DashboardReports.Update(dashboardReport);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var dashboardReport = await _context.DashboardReports.FindAsync(id);
            if (dashboardReport != null)
            {
                _context.DashboardReports.Remove(dashboardReport);
                await _context.SaveChangesAsync();
            }
        }

        // Dashboard Specific Methods
        public async Task<DashboardReport> GetLatestDashboardReportAsync(string timeRange)
        {
            return await _context.DashboardReports
                .Where(r => r.TimeRange == timeRange)
                .OrderByDescending(r => r.LastUpdated)
                .FirstOrDefaultAsync();
        }

        public async Task<DashboardReport> GetDashboardReportByIdAsync(int id)
        {
            return await _context.DashboardReports.FindAsync(id);
        }

        public async Task<IEnumerable<DashboardReport>> GetDashboardReportHistoryAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.DashboardReports
                .Where(r => r.LastUpdated >= startDate && r.LastUpdated <= endDate)
                .OrderByDescending(r => r.LastUpdated)
                .ToListAsync();
        }

        public async Task UpdateDashboardReportAsync(DashboardReport report)
        {
            _context.DashboardReports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task CreateDashboardReportAsync(DashboardReport report)
        {
            await _context.DashboardReports.AddAsync(report);
            await _context.SaveChangesAsync();
        }

        public async Task<decimal> GetTotalSalesAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .SumAsync(o => o.TotalAmount ?? 0);
        }

        public async Task<int> GetTotalOrdersAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .CountAsync();
        }

        public async Task<int> GetActiveUsersCountAsync()
        {
            // Consider users active if they have placed an order in the last 30 days
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            return await _context.Orders
                .Where(o => o.OrderDate >= thirtyDaysAgo)
                .Select(o => o.UserId)
                .Distinct()
                .CountAsync();
        }

        public async Task<decimal> CalculateGrowthRateAsync(decimal currentValue, decimal previousValue)
        {
            if (previousValue == 0)
                return 0;

            return ((currentValue - previousValue) / previousValue) * 100;
        }
    }
}
