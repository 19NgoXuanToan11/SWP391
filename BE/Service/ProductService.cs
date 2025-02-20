using Data.Models;
using Repo;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

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
            try
            {
                _logger.LogInformation("Starting to retrieve products");

                IQueryable<Product> query = _context.Products;
                _logger.LogInformation("Got Products DbSet");

                query = query.Include(p => p.SkinType);
                query = query.Include(p => p.Brand);
                query = query.Include(p => p.Volume);
                query = query.Include(p => p.Category);
                // Tạm thời comment dòng này
                // query = query.Include(p => p.Images);
        
                query = query.AsNoTracking();

                var products = await query.ToListAsync();
                _logger.LogInformation($"Retrieved {products.Count} products successfully");

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products. Exception details: {Message}, Stack trace: {StackTrace}", 
                    ex.Message, ex.StackTrace);
                
                if (ex.InnerException != null)
                {
                    _logger.LogError("Inner exception: {Message}, Stack trace: {StackTrace}", 
                        ex.InnerException.Message, ex.InnerException.StackTrace);
                }
                
                throw new Exception($"Error retrieving products: {ex.Message}", ex);
            }
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
                product.CreatedAt = DateTime.UtcNow;
                
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
                
                var skinType = await _context.SkinTypes.FindAsync(product.SkinTypeId);
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

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
        {
            return await _productRepository.SearchProductsAsync(searchTerm);
        }
    }
}
