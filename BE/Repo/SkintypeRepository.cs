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
            try
            {
                return await _context.Skintypes
                    // Only include related entities if needed
                    // .Include(s => s.Products)
                    // .Include(s => s.SkinRoutines)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve skin types from database: {ex.Message}", ex);
            }
        }

        public async Task<Skintype?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Skintypes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.SkinTypeId == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve skin type with ID {id}: {ex.Message}", ex);
            }
        }

        public async Task AddAsync(Skintype skinType)
        {
            try
            {
                await _context.Skintypes.AddAsync(skinType);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to add skin type: {ex.Message}", ex);
            }
        }

        public async Task UpdateAsync(Skintype skinType)
        {
            try
            {
                _context.Skintypes.Update(skinType);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to update skin type: {ex.Message}", ex);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var skinType = await _context.Skintypes.FindAsync(id);
                if (skinType != null)
                {
                    _context.Skintypes.Remove(skinType);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete skin type: {ex.Message}", ex);
            }
        }
    }
}
