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

        // L?y t?t c? khuy?n mãi
        public async Task<IEnumerable<Promotion>> GetAllAsync()
        {
            return await _context.Promotions.ToListAsync();
        }

        // L?y khuy?n mãi theo ID
        public async Task<Promotion?> GetByIdAsync(int id)
        {
            return await _context.Promotions.FindAsync(id);
        }

        // Thêm khuy?n mãi
        public async Task AddAsync(Promotion promotion)
        {
            await _context.Promotions.AddAsync(promotion);
            await _context.SaveChangesAsync();
        }

        // C?p nh?t khuy?n mãi
        public async Task UpdateAsync(Promotion promotion)
        {
            _context.Promotions.Update(promotion);
            await _context.SaveChangesAsync();
        }

        // Xóa khuy?n mãi
        public async Task DeleteAsync(int id)
        {
            var promotion = await _context.Promotions.FindAsync(id);
            if (promotion != null)
            {
                _context.Promotions.Remove(promotion);
                await _context.SaveChangesAsync();
            }
        }

        // L?y khuy?n mãi ?ang áp d?ng cho ??n hàng (d?a trên ngày hi?n t?i)
        public async Task<Promotion?> GetActivePromotionAsync()
        {
            return await _context.Promotions
                                 .Where(p => p.StartDate <= DateTime.Now && p.EndDate >= DateTime.Now)
                                 .FirstOrDefaultAsync();
        }
    }
}
