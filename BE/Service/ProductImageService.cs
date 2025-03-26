using Data.Models;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;
        private readonly IProductService _productService;
        private readonly ILogger<ProductImageService> _logger;

        public ProductImageService(
            IProductImageRepository productImageRepository,
            IProductService productService,
            ILogger<ProductImageService> logger)
        {
            _productImageRepository = productImageRepository;
            _productService = productService;
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
                _logger.LogInformation("Deleting product image with ID: {Id}", id);

                // L?y ProductImage ?? tìm ProductId
                var productImage = await _productImageRepository.GetProductImageByIdAsync(id);
                if (productImage == null)
                {
                    _logger.LogWarning("Product image with ID {Id} not found", id);
                    throw new KeyNotFoundException($"Product image with ID {id} not found");
                }

                // L?y ProductId t? ProductImage
                int productId = productImage.ProductId;
                _logger.LogInformation("Found product image with ID {Id} for product ID {ProductId}", id, productId);

                // G?i ProductService ?? xóa Product và t?t c? thông tin liên quan
                await _productService.DeleteProductAsync(productId);

                _logger.LogInformation("Product with ID {ProductId} and related product image with ID {Id} deleted successfully", productId, id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting product image with ID: {Id}, Message: {Message}", id, ex.Message);
                throw new Exception($"Failed to delete product image with ID {id}: {ex.Message}", ex);
            }
        }
    }
}