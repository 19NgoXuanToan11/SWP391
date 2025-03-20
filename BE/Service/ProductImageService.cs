using Data.Models;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;
        private readonly ILogger<ProductImageService> _logger;

        public ProductImageService(IProductImageRepository productImageRepository, ILogger<ProductImageService> logger)
        {
            _productImageRepository = productImageRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<ProductImage>> GetAllProductImagesAsync()
        {
            try
            {
                return await _productImageRepository.GetAllProductImagesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all product images");
                throw;
            }
        }

        public async Task<ProductImage?> GetProductImageByIdAsync(int id)
        {
            try
            {
                return await _productImageRepository.GetProductImageByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting product image with ID: {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId)
        {
            try
            {
                return await _productImageRepository.GetImagesByProductIdAsync(productId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting images for product ID: {ProductId}", productId);
                throw;
            }
        }

        public async Task AddProductImageAsync(ProductImage productImage)
        {
            try
            {
                await _productImageRepository.AddProductImageAsync(productImage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding product image");
                throw;
            }
        }

        public async Task UpdateProductImageAsync(ProductImage productImage)
        {
            try
            {
                await _productImageRepository.UpdateProductImageAsync(productImage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating product image with ID: {Id}", productImage.ImageId);
                throw;
            }
        }

        public async Task DeleteProductImageAsync(int id)
        {
            try
            {
                await _productImageRepository.DeleteProductImageAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting product image with ID: {Id}", id);
                throw;
            }
        }
    }
} 