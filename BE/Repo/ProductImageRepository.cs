using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Repo
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly SkinCareManagementDbContext _context;
        private readonly ILogger<ProductImageRepository> _logger;

        public ProductImageRepository(SkinCareManagementDbContext context, ILogger<ProductImageRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<ProductImage>> GetAllProductImagesAsync()
        {
            return await _context.ProductImage
                .Include(pi => pi.Product)
                .ToListAsync();
        }

        public async Task<ProductImage?> GetProductImageByIdAsync(int id)
        {
            return await _context.ProductImage
                .Include(pi => pi.Product)
                .FirstOrDefaultAsync(pi => pi.ImageId == id);
        }

        public async Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId)
        {
            return await _context.ProductImage
                .Where(pi => pi.ProductId == productId)
                .Include(pi => pi.Product)
                .ToListAsync();
        }

        public async Task AddProductImageAsync(ProductImage productImage)
        {
            await _context.ProductImage.AddAsync(productImage);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProductImageAsync(ProductImage productImage)
        {
            _context.Entry(productImage).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProductImageAsync(int id)
        {
            var productImage = await _context.ProductImage.FindAsync(id);
            if (productImage != null)
            {
                _context.ProductImage.Remove(productImage);
                await _context.SaveChangesAsync();
            }
        }
    }
} 