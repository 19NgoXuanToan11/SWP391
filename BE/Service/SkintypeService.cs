using Data.Models;
using Repo;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Service
{
    public class SkinTypeService : ISkinTypeService
    {
        private readonly ISkinTypeRepository _skinTypeRepository;
        private readonly ILogger<SkinTypeService> _logger;
        private readonly SkinCareManagementDbContext _context;

        public SkinTypeService(
            ISkinTypeRepository skinTypeRepository, 
            ILogger<SkinTypeService> logger,
            SkinCareManagementDbContext context)
        {
            _skinTypeRepository = skinTypeRepository;
            _logger = logger;
            _context = context;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Skintypes.AnyAsync(s => s.SkinTypeId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if skin type exists with ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Skintype>> GetAllSkinTypesAsync()
        {
            try
            {
                return await _skinTypeRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all skin types");
                throw;
            }
        }

        public async Task<Skintype?> GetSkinTypeByIdAsync(int id)
        {
            try
            {
                return await _skinTypeRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting skin type with ID {Id}", id);
                throw;
            }
        }

        public async Task AddSkinTypeAsync(Skintype skinType)
        {
            try
            {
                if (skinType == null)
                    throw new ArgumentNullException(nameof(skinType));

                await _skinTypeRepository.AddAsync(skinType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding skin type: {SkinTypeName}", skinType?.SkinTypeName);
                throw;
            }
        }

        public async Task UpdateSkinTypeAsync(Skintype skinType)
        {
            try
            {
                if (skinType == null)
                    throw new ArgumentNullException(nameof(skinType));

                await _skinTypeRepository.UpdateAsync(skinType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating skin type: {SkinTypeId}", skinType?.SkinTypeId);
                throw;
            }
        }

        public async Task DeleteSkinTypeAsync(int id)
        {
            try
            {
                await _skinTypeRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting skin type with ID {Id}", id);
                throw;
            }
        }
    }
}
