using Data.Models;
using Repo;
using Microsoft.Extensions.Logging;

namespace Service
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<ProductService> _logger;

        public ProductService(IProductRepository productRepository, ILogger<ProductService> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByBrandAsync(int brandId)
        {
            return await _productRepository.GetProductsByBrandAsync(brandId);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            return await _productRepository.GetProductsByCategoryAsync(categoryId);
        }

        public async Task<IEnumerable<Product>> GetProductsBySkinTypeAsync(int skinTypeId)
        {
            return await _productRepository.GetProductsBySkinTypeAsync(skinTypeId);
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            try
            {
                await _productRepository.AddAsync(product);
                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding product");
                throw;
            }
        }

        public async Task UpdateProductAsync(Product product)
        {
            try
            {
                await _productRepository.UpdateAsync(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product");
                throw;
            }
        }

        public async Task DeleteProductAsync(int id)
        {
            try
            {
                await _productRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product");
                throw;
            }
        }

        public async Task<bool> UpdateProductImagesAsync(int productId, List<string> imageUrls)
        {
            try
            {
                var product = await GetProductByIdAsync(productId);
                if (product == null) return false;

                // Clear existing images
                product.Images.Clear();

                // Add new images
                foreach (var url in imageUrls)
                {
                    product.Images.Add(new ProductImage { ImageUrl = url });
                }

                await UpdateProductAsync(product);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product images");
                return false;
            }
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
        {
            return await _productRepository.SearchProductsAsync(searchTerm);
        }
    }
}
