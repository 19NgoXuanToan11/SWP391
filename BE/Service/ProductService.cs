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
            try
            {
                _logger.LogInformation("Getting product with ID: {Id}", id);
                
                var product = await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Volume)
                    .Include(p => p.SkinType)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.ProductId == id);

                if (product == null)
                {
                    _logger.LogWarning("Product with ID {Id} not found", id);
                    return null;
                }

                _logger.LogInformation("Successfully retrieved product with ID: {Id}", id);
                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by ID {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByBrandAsync(int brandId)
        {
            try
            {
                _logger.LogInformation("Getting products for brand ID: {BrandId}", brandId);
                
                var products = await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Volume)
                    .Include(p => p.SkinType)
                    .Include(p => p.Category)
                    .Where(p => p.BrandId == brandId)
                    .AsNoTracking()
                    .ToListAsync();

                _logger.LogInformation("Found {Count} products for brand ID {BrandId}", products.Count, brandId);
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by brand {BrandId}: {Message}", brandId, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            try
            {
                return await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Volume)
                    .Include(p => p.SkinType)
                    .Include(p => p.Category)
                    .Where(p => p.CategoryId == categoryId)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by category {CategoryId}: {Message}", categoryId, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Product>> GetProductsBySkinTypeAsync(int skinTypeId)
        {
            try
            {
                return await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Volume)
                    .Include(p => p.SkinType)
                    .Include(p => p.Category)
                    .Where(p => p.SkinTypeId == skinTypeId)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by skin type {SkinTypeId}: {Message}", skinTypeId, ex.Message);
                throw;
            }
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
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Xóa theo đúng tên bảng và cột
                var deleteProductImages = "DELETE FROM ProductImages WHERE ProductId = @id";
                var deleteOrderDetails = "DELETE FROM OrderDetails WHERE ProductID = @id";  // Chú ý chữ ID viết hoa
                var deleteFeedbacks = "DELETE FROM Feedbacks WHERE ProductID = @id";  // Chú ý tên bảng số nhiều và ID viết hoa
                var deleteProduct = "DELETE FROM Products WHERE ProductID = @id";  // Chú ý ID viết hoa

                // Thực hiện xóa theo thứ tự từ con đến cha
                await _context.Database.ExecuteSqlRawAsync(deleteProductImages, new Microsoft.Data.SqlClient.SqlParameter("@id", id));
                await _context.Database.ExecuteSqlRawAsync(deleteOrderDetails, new Microsoft.Data.SqlClient.SqlParameter("@id", id));
                await _context.Database.ExecuteSqlRawAsync(deleteFeedbacks, new Microsoft.Data.SqlClient.SqlParameter("@id", id));
                var result = await _context.Database.ExecuteSqlRawAsync(deleteProduct, new Microsoft.Data.SqlClient.SqlParameter("@id", id));

                if (result == 0)
                {
                    throw new Exception($"Product with ID {id} not found");
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error deleting product {Id}: {Message}", id, ex.Message);
                throw;
            }
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
        {
            try
            {
                return await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Volume)
                    .Include(p => p.SkinType)
                    .Include(p => p.Category)
                    .Where(p => p.ProductName.Contains(searchTerm) 
                        || p.Description.Contains(searchTerm)
                        || p.MainIngredients.Contains(searchTerm))
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with term {SearchTerm}: {Message}", searchTerm, ex.Message);
                throw;
            }
        }
    }
}
