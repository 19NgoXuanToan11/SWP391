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

        public async Task<IEnumerable<SkinType>> GetAllSkintypesAsync()
        {
            return await _context.SkinTypes.ToListAsync();
        }

        public async Task<SkinType?> GetSkintypeByIdAsync(int id)
        {
            return await _context.SkinTypes.FindAsync(id);
        }

        public async Task AddSkintypeAsync(SkinType skintype)
        {
            await _context.SkinTypes.AddAsync(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSkintypeAsync(SkinType skintype)
        {
            _context.SkinTypes.Update(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSkintypeAsync(int id)
        {
            var skintype = await _context.SkinTypes.FindAsync(id);
            if (skintype != null)
            {
                _context.SkinTypes.Remove(skintype);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.SkinTypes.AnyAsync(s => s.SkinTypeId == id);
        }   
    }
}
