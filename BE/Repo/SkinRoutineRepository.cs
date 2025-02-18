using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class SkinRoutineRepository : ISkinRoutineRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public SkinRoutineRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SkinRoutine>> GetAllAsync()
        {
            return await _context.SkinRoutines.ToListAsync();
        }

        public async Task<SkinRoutine?> GetByIdAsync(int id)
        {
            return await _context.SkinRoutines.FindAsync(id);
        }

        public async Task AddAsync(SkinRoutine skinRoutine)
        {
            await _context.SkinRoutines.AddAsync(skinRoutine);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SkinRoutine skinRoutine)
        {
            _context.SkinRoutines.Update(skinRoutine);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var skinRoutine = await _context.SkinRoutines.FindAsync(id);
            if (skinRoutine != null)
            {
                _context.SkinRoutines.Remove(skinRoutine);
                await _context.SaveChangesAsync();
            }
        }
    }
}
