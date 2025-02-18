using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class DashboardReportRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public DashboardReportRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

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
    }
}
