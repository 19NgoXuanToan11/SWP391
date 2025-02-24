using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Service
{
    public class BrandService : IBrandService
    {
        private readonly SkinCareManagementDbContext _context;

        public BrandService(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Brands.AnyAsync(b => b.BrandId == id);
        }
    }
} 