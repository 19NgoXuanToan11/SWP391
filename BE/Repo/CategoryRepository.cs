using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public CategoryRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            try
            {
                return await _context.Categories
                    // Only include Products if you really need them
                    // .Include(c => c.Products)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve categories from database: {ex.Message}", ex);
            }
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Categories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.CategoryId == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve category with ID {id}: {ex.Message}", ex);
            }
        }

        public async Task AddAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Category>> SearchByCategoryNameAsync(string categoryName)
        {
            try
            {
                return await _context.Categories
                    .AsNoTracking()
                    .Where(c => c.CategoryName.Contains(categoryName))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to search categories by name: {ex.Message}", ex);
            }
        }
    }
} 