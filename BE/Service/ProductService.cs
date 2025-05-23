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
                query = query.Include(p => p.Images);

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
                    .Include(p => p.Images)
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
                    .Include(p => p.Images)
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
                    .Include(p => p.Images)
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
                    .Include(p => p.Images)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by skin type {SkinTypeId}: {Message}", skinTypeId, ex.Message);
                throw;
            }
        }

        public async Task<Product> AddProductAsync(Product product, List<string> imageUrls)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Set creation date if not already set
                if (!product.CreatedAt.HasValue)
                {
                    product.CreatedAt = DateTime.UtcNow;
                }

                // Add the product first
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Now add all the images
                _logger.LogInformation($"Adding {imageUrls.Count} images for new product {product.ProductId}");

                for (int i = 0; i < imageUrls.Count; i++)
                {
                    var imageUrl = imageUrls[i];
                    _logger.LogInformation($"Adding image URL: {imageUrl}");

                    var productImage = new ProductImage
                    {
                        ProductId = product.ProductId,
                        ImageUrl = imageUrl,
                        IsMainImage = i == 0 // First image is the main image
                    };

                    _context.ProductImage.Add(productImage);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation($"Successfully added product {product.ProductId} with {imageUrls.Count} images");

                // Reload the product with all related data
                return await GetProductByIdAsync(product.ProductId);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, $"Error adding product with images: {ex.Message}");
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
                _logger.LogInformation("Deleting product with ID: {Id}", id);

                // Kiểm tra xem Product có tồn tại không
                var productExists = await _context.Products.AnyAsync(p => p.ProductId == id);
                if (!productExists)
                {
                    _logger.LogWarning("Product with ID {Id} not found", id);
                    throw new KeyNotFoundException($"Product with ID {id} not found");
                }

                // Xóa các bản ghi liên quan
                // Sửa tên bảng từ ProductImages thành ProductImage
                await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM ProductImage WHERE ProductId = @id",
                    new Microsoft.Data.SqlClient.SqlParameter("@id", id));

                await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM OrderDetails WHERE ProductID = @id",
                    new Microsoft.Data.SqlClient.SqlParameter("@id", id));

                await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Feedbacks WHERE ProductID = @id",
                    new Microsoft.Data.SqlClient.SqlParameter("@id", id));

                // Nếu có các bảng khác tham chiếu đến ProductId, thêm lệnh xóa tại đây
                // Ví dụ:
                // await _context.Database.ExecuteSqlRawAsync(
                //     "DELETE FROM CartItems WHERE ProductID = @id",
                //     new Microsoft.Data.SqlClient.SqlParameter("@id", id));

                // Xóa Product
                var result = await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM Products WHERE ProductID = @id",
                    new Microsoft.Data.SqlClient.SqlParameter("@id", id));

                if (result == 0)
                {
                    _logger.LogWarning("Product with ID {Id} not found after deleting related records", id);
                    throw new KeyNotFoundException($"Product with ID {id} not found after deleting related records");
                }

                await transaction.CommitAsync();
                _logger.LogInformation("Product with ID {Id} deleted successfully.", id);
            }
            catch (Microsoft.Data.SqlClient.SqlException sqlEx)
            {
                await transaction.RollbackAsync();
                _logger.LogError(sqlEx, "SQL error deleting product {Id}: {Message}", id, sqlEx.Message);
                throw new Exception($"Database error while deleting product: {sqlEx.Message}", sqlEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error deleting product {Id}: {Message}", id, ex.Message);
                throw new Exception($"Error deleting product: {ex.Message}", ex);
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

        public async Task UpdateProductStockAsync(int productId, int quantity)
        {
            var product = await _productRepository.GetByIdAsync(productId);
            if (product != null && product.Stock.HasValue)
            {
                product.Stock = product.Stock.Value - quantity;
                await _productRepository.UpdateAsync(product);
            }
        }

        public async Task RestoreProductStockAsync(int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                throw new Exception($"Product with ID {productId} not found.");
            }

            // Cộng lại số lượng tồn kho
            product.Stock += quantity;
            if (product.Stock < 0) // Đảm bảo Stock không âm
            {
                product.Stock = 0;
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateProductImagesAsync(int productId, List<string> imageUrls)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                throw new Exception($"Product with ID {productId} not found");
            }

            // Remove all existing images from the database
            _context.ProductImage.RemoveRange(product.Images);
            await _context.SaveChangesAsync();

            // Clear the images collection in memory
            product.Images.Clear();

            // Add new images
            var imagesList = new List<ProductImage>();
            for (int i = 0; i < imageUrls.Count; i++)
            {
                var newImage = new ProductImage
                {
                    ProductId = productId,
                    ImageUrl = imageUrls[i],
                    IsMainImage = i == 0 // First image is main
                };

                imagesList.Add(newImage);
                _context.ProductImage.Add(newImage);
            }

            // Update the product's image collection with new images
            foreach (var image in imagesList)
            {
                product.Images.Add(image);
            }

            await _context.SaveChangesAsync();

            // Log the update for debugging
            _logger.LogInformation($"Updated product {productId} with {imageUrls.Count} images");
        }
    }
}