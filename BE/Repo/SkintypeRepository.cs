using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class SkinTypeRepository : ISkinTypeRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public SkinTypeRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Skintype>> GetAllAsync()
        {
            return await _context.Skintypes.ToListAsync();
        }

        public async Task<Skintype?> GetByIdAsync(int id)
        {
            return await _context.Skintypes.FindAsync(id);
        }

        public async Task AddAsync(Skintype skinType)
        {
            await _context.Skintypes.AddAsync(skinType);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Skintype skinType)
        {
            _context.Skintypes.Update(skinType);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var skinType = await _context.Skintypes.FindAsync(id);
            if (skinType != null)
            {
                _context.Skintypes.Remove(skinType);
                await _context.SaveChangesAsync();
            }
        }
    }
}
