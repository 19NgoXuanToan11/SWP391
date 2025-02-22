using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
<<<<<<< HEAD
    public class SkintypeRepository : ISkinTypeRepository

=======
    public class SkinTypeRepository : ISkinTypeRepository
>>>>>>> af1c48fb3a3ea141eef7ae1e7b25de7ca33333a6
    {
        private readonly SkinCareManagementDbContext _context;

        public SkinTypeRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SkinType>> GetAllAsync()
        {
            return await _context.SkinTypes.ToListAsync();
        }

        public async Task<SkinType?> GetByIdAsync(int id)
        {
            return await _context.SkinTypes.FindAsync(id);
        }

<<<<<<< HEAD
        public async Task AddAsync(SkinType skintype)
        {   
=======
        public async Task AddAsync(Skintype skintype)
        {
>>>>>>> af1c48fb3a3ea141eef7ae1e7b25de7ca33333a6
            await _context.SkinTypes.AddAsync(skintype);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SkinType skintype)
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
