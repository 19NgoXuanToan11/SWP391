using Data.Models;

namespace Service
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<IEnumerable<Product>> GetProductsByBrandAsync(int brandId);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<Product>> GetProductsBySkinTypeAsync(int skinTypeId);
        Task<Product> AddProductAsync(Product product, List<string> imageUrls);
        Task UpdateProductAsync(Product product);
        Task DeleteProductAsync(int id);
        Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm);
        Task UpdateProductStockAsync(int productId, int quantity);
        Task RestoreProductStockAsync(int productId, int quantity);
        Task UpdateProductImagesAsync(int productId, List<string> imageUrls);

    }
}
