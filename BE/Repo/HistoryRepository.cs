using Data.Models;
using Google;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repo
{
    public class HistoryRepository : IHistoryRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public HistoryRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<History>> GetAllAsync()
        {
            return await _context.History.Include(h => h.OrderDetails).ToListAsync();
        }

        public async Task<History?> GetByTrackingCodeAsync(string trackingCode)
        {
            return await _context.History
                .Include(h => h.OrderDetails)
                .FirstOrDefaultAsync(h => h.TrackingCode == trackingCode);
        }

        public async Task AddAsync(History history)
        {
            _context.History.Add(history);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(History history)
        {
            _context.History.Update(history);
            await _context.SaveChangesAsync();
        }
    }
}
