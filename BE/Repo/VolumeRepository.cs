using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class VolumeRepository : IVolumeRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public VolumeRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Volume>> GetAllAsync()
        {
            return await _context.Volumes.ToListAsync();
        }

        public async Task<Volume?> GetByIdAsync(int id)
        {
            return await _context.Volumes.FindAsync(id);
        }

        public async Task AddAsync(Volume volume)
        {
            await _context.Volumes.AddAsync(volume);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Volume volume)
        {
            _context.Volumes.Update(volume);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var volume = await _context.Volumes.FindAsync(id);
            if (volume != null)
            {
                _context.Volumes.Remove(volume);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Volume>> SearchByValueAsync(string value)
        {
            return await _context.Volumes
                .Where(v => v.VolumeSize.Contains(value))
                .ToListAsync();
        }
    }
} 