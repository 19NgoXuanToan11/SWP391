using Data.Models;
using Repo;
using Microsoft.Extensions.Logging;

namespace Service
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<ProductService> _logger;
        private readonly SkinCareManagementDbContext _context;

        public ProductService(
            IProductRepository productRepository, 
            ILogger<ProductService> logger,
            SkinCareManagementDbContext context)
        {
            _productRepository = productRepository;
            _logger = logger;
            _context = context;
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
                // Thêm thời gian tạo
                product.CreatedAt = DateTime.UtcNow;
                
                // Kiểm tra các foreign key có tồn tại
                var brand = await _context.Brands.FindAsync(product.BrandId);
                if (brand == null) 
                {
                    _logger.LogError($"Brand with ID {product.BrandId} not found");
                    throw new Exception($"Brand với ID {product.BrandId} không tồn tại");
                }
                
                var volume = await _context.Volumes.FindAsync(product.VolumeId);
                if (volume == null)
                {
                    _logger.LogError($"Volume with ID {product.VolumeId} not found");
                    throw new Exception($"Volume với ID {product.VolumeId} không tồn tại");
                }
                
                var skinType = await _context.Skintypes.FindAsync(product.SkinTypeId);
                if (skinType == null)
                {
                    _logger.LogError($"SkinType with ID {product.SkinTypeId} not found");
                    throw new Exception($"SkinType với ID {product.SkinTypeId} không tồn tại");
                }
                
                var category = await _context.Categories.FindAsync(product.CategoryId);
                if (category == null)
                {
                    _logger.LogError($"Category with ID {product.CategoryId} not found");
                    throw new Exception($"Category với ID {product.CategoryId} không tồn tại");
                }

                // Thêm sản phẩm
                await _productRepository.AddAsync(product);

                // Log thành công
                _logger.LogInformation($"Product {product.ProductName} created successfully");
                
                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding product: {Message}", ex.Message);
                throw new Exception("Có lỗi xảy ra khi tạo sản phẩm", ex);
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
