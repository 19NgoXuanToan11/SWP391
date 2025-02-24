using Data.Models;

namespace Repo
{
    public interface IProductImageRepository
    {
        Task<IEnumerable<ProductImage>> GetAllProductImagesAsync();
        Task<ProductImage?> GetProductImageByIdAsync(int id);
        Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId);
        Task AddProductImageAsync(ProductImage productImage);
        Task UpdateProductImageAsync(ProductImage productImage);
        Task DeleteProductImageAsync(int id);
    }
} 