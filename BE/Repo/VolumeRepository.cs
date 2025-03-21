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
            try
            {
                return await _context.Volume
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve volumes from database: {ex.Message}", ex);
            }
        }

        public async Task<Volume?> GetByIdAsync(int id)
        {
            return await _context.Volume.FindAsync(id);
        }

        public async Task AddAsync(Volume volume)
        {
            await _context.Volume.AddAsync(volume);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Volume volume)
        {
            _context.Volume.Update(volume);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var volume = await _context.Volume.FindAsync(id);
            if (volume != null)
            {
                _context.Volume.Remove(volume);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Volume>> SearchByValueAsync(string value)
        {
            return await _context.Volume
                .Where(v => v.VolumeSize.Contains(value))
                .ToListAsync();
        }
    }
}