using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Service
{
    public class SkinTypeService : ISkinTypeService
    {
        private readonly SkinCareManagementDbContext _context;

        public SkinTypeService(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Skintype>> GetAllSkintypesAsync()
        {
            return await _context.Skintypes.ToListAsync();
        }

        public async Task<Skintype?> GetSkintypeByIdAsync(int id)
        {
            return await _context.Skintypes.FindAsync(id);
        }

        public async Task AddSkintypeAsync(Skintype skintype)
        {
            await _context.Skintypes.AddAsync(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSkintypeAsync(Skintype skintype)
        {
            _context.Skintypes.Update(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSkintypeAsync(int id)
        {
            var skintype = await _context.Skintypes.FindAsync(id);
            if (skintype != null)
            {
                _context.Skintypes.Remove(skintype);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Skintypes.AnyAsync(s => s.SkinTypeId == id);
        }
    }
}
