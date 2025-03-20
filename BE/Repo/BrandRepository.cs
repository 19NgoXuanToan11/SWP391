using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class BrandRepository : IBrandRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public BrandRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brand>> GetAllAsync()
        {
            try
            {
                return await _context.Brand
                    // Only include Products if you really need them
                    // .Include(b => b.Products)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve brands from database: {ex.Message}", ex);
            }
        }

        public async Task<Brand?> GetByIdAsync(int id)
        {
            return await _context.Brand
                .Include(b => b.Products)
                .FirstOrDefaultAsync(b => b.BrandId == id);
        }

        public async Task AddAsync(Brand brand)
        {
            await _context.Brand.AddAsync(brand);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Brand brand)
        {
            _context.Brand.Update(brand);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var brand = await _context.Brand.FindAsync(id);
            if (brand != null)
            {
                _context.Brand.Remove(brand);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Brand>> SearchByBrandNameAsync(string brandName)
        {
            return await _context.Brand
                .Where(b => b.BrandName.Contains(brandName))
                .ToListAsync();
        }
    }
}