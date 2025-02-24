using Data.Models;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly ILogger<BrandService> _logger;

        public BrandService(IBrandRepository brandRepository, ILogger<BrandService> logger)
        {
            _brandRepository = brandRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Brand>> GetAllBrandsAsync()
        {
            try
            {
                return await _brandRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all brands");
                throw;
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