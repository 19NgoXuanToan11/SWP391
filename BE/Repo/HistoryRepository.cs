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

        public async Task<History?> GetOrderHistoryByOrderIdAsync(int orderId)
        {
            try
            {
                return await _context.History
                    .Include(h => h.OrderDetails)
                        .ThenInclude(od => od.Product)
                            .ThenInclude(p => p.Images)
                    .FirstOrDefaultAsync(h => h.OrderDetails.Any(od => od.OrderId == orderId));
            }
            catch (Exception)
            {
                // If there's an error (like missing table or column), return null
                return null;
            }
        }
        public async Task<IEnumerable<History>> GetHistoriesByUserIdAsync(int userId)
        {
            return await _context.History
                .Include(h => h.OrderDetails)
                    .ThenInclude(od => od.Product)
                        .ThenInclude(p => p.Images)
                .Include(h => h.OrderDetails) // Include OrderDetails
                    .ThenInclude(od => od.Order) // Include Order để lấy TotalAmount
                .Where(h => h.OrderDetails.Any(od => od.Order.UserId == userId))
                .ToListAsync();
        }
    }
}
