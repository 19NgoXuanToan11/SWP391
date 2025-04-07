using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public PromotionRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        // L?y t?t c? khuy?n m�i
        public async Task<IEnumerable<Promotion>> GetAllAsync()
        {
            return await _context.Promotions.ToListAsync();
        }

        // L?y khuy?n m�i theo ID
        public async Task<Promotion?> GetByIdAsync(int id)
        {
            return await _context.Promotions.FindAsync(id);
        }

        // Th�m khuy?n m�i
        public async Task AddAsync(Promotion promotion)
        {
            await _context.Promotions.AddAsync(promotion);
            await _context.SaveChangesAsync();
        }

        // C?p nh?t khuy?n m�i
        public async Task UpdateAsync(Promotion promotion)
        {
            _context.Promotions.Update(promotion);
            await _context.SaveChangesAsync();
        }

        // X�a khuy?n m�i
        public async Task DeleteAsync(int id)
        {
            var promotion = await _context.Promotions.FindAsync(id);
            if (promotion != null)
            {
                _context.Promotions.Remove(promotion);
                await _context.SaveChangesAsync();
            }
        }

        // L?y khuy?n m�i ?ang �p d?ng cho ??n h�ng (d?a tr�n ng�y hi?n t?i)
        public async Task<Promotion?> GetActivePromotionAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Promotions
                .FirstOrDefaultAsync(p => p.StartDate <= now && p.EndDate >= now && p.IsActive);
        }
    }
}
