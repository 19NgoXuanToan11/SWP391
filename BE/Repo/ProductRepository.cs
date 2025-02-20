using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class ProductRepository : IProductRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public ProductRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Volume)
                .Include(p => p.SkinType)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Volume)
                .Include(p => p.SkinType)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public async Task<IEnumerable<Product>> GetProductsByBrandAsync(int brandId)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Volume)
                .Include(p => p.SkinType)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.BrandId == brandId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Volume)
                .Include(p => p.SkinType)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsBySkinTypeAsync(int skinTypeId)
        {
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Volume)
                .Include(p => p.SkinType)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.SkinTypeId == skinTypeId)
                .ToListAsync();
        }

        public async Task AddAsync(Product product)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Lưu danh sách ảnh tạm thời
                var images = product.Images.ToList();
                product.Images.Clear();

                // Thêm sản phẩm
                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();

                // Thêm ảnh sản phẩm
                foreach (var image in images)
                {
                    image.ProductId = product.ProductId;
                    await _context.ProductImages.AddAsync(image);
                }
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception("Lỗi khi lưu sản phẩm vào database", ex);
            }
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            searchTerm = searchTerm.ToLower();
            return await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Volume)
                .Include(p => p.SkinType)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.ProductName.ToLower().Contains(searchTerm) ||
                            (p.Description != null && p.Description.ToLower().Contains(searchTerm)) ||
                            (p.Brand != null && p.Brand.BrandName.ToLower().Contains(searchTerm)) ||
                            (p.Category != null && p.Category.CategoryName.ToLower().Contains(searchTerm)))
                .ToListAsync();
        }
    }
}