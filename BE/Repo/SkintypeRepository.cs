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
            return await _context.SkinTypes.ToListAsync();
        }

        public async Task<Skintype?> GetByIdAsync(int id)
        {
            return await _context.SkinTypes.FindAsync(id);
        }

        public async Task AddAsync(Skintype skintype)
        {
            await _context.SkinTypes.AddAsync(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Skintype skintype)
        {
            _context.SkinTypes.Update(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var skintype = await _context.SkinTypes.FindAsync(id);
            if (skintype != null)
            {
                _context.SkinTypes.Remove(skintype);
                await _context.SaveChangesAsync();
            }
        }
    }
}
