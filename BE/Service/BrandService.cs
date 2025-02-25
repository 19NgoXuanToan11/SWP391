using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly ILogger<BrandService> _logger;
        private readonly SkinCareManagementDbContext _context;

        public BrandService(
            IBrandRepository brandRepository,
            ILogger<BrandService> logger,
            SkinCareManagementDbContext context)
        {
            _brandRepository = brandRepository;
            _logger = logger;
            _context = context;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Brand.AnyAsync(b => b.BrandId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if brand exists with ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Brand>> GetAllBrandsAsync()
        {
            try
            {
                // Verify database connection
                if (!await _context.Database.CanConnectAsync())
                {
                    throw new Exception("Cannot connect to database");
                }

                var brands = await _brandRepository.GetAllAsync();
                _logger.LogInformation("Retrieved {Count} brands from database", brands.Count());
                return brands;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all brands: {Message}", ex.Message);
                throw new Exception($"Failed to retrieve brands: {ex.Message}", ex);
            }
        }

        public async Task<Brand?> GetBrandByIdAsync(int id)
        {
            try
            {
                return await _brandRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting brand with ID {Id}", id);
                throw;
            }
        }

        public async Task AddBrandAsync(Brand brand)
        {
            try
            {
                if (brand == null)
                    throw new ArgumentNullException(nameof(brand));

                await _brandRepository.AddAsync(brand);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding brand: {BrandName}", brand?.BrandName);
                throw;
            }
        }

        public async Task UpdateBrandAsync(Brand brand)
        {
            try
            {
                if (brand == null)
                    throw new ArgumentNullException(nameof(brand));

                await _brandRepository.UpdateAsync(brand);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating brand: {BrandId}", brand?.BrandId);
                throw;
            }
        }

        public async Task DeleteBrandAsync(int id)
        {
            try
            {
                await _brandRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting brand with ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Brand>> SearchByBrandNameAsync(string brandName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(brandName))
                    throw new ArgumentException("Brand name cannot be empty", nameof(brandName));

                return await _brandRepository.SearchByBrandNameAsync(brandName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching brands by name: {BrandName}", brandName);
                throw;
            }
        }
    }
}