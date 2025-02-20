using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Service
{
    public class VolumeService : IVolumeService
    {
        private readonly SkinCareManagementDbContext _context;

        public VolumeService(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Volumes.AnyAsync(v => v.VolumeId == id);
        }
    }
} 