using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class SkintypeRepository : ISkintypeRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public SkintypeRepository(SkinCareManagementDbContext context)
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

        public async Task AddAsync(Skintype skintype)
        {
            await _context.Skintypes.AddAsync(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Skintype skintype)
        {
            _context.Skintypes.Update(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var skintype = await _context.Skintypes.FindAsync(id);
            if (skintype != null)
            {
                _context.Skintypes.Remove(skintype);
                await _context.SaveChangesAsync();
            }
        }
    }
}
