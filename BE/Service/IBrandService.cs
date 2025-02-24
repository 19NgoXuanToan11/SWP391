using Data.Models;

namespace Service
{
    public interface IBrandService
    {
        Task<IEnumerable<Brand>> GetAllBrandsAsync();
        Task<Brand?> GetBrandByIdAsync(int id);
        Task AddBrandAsync(Brand brand);
        Task UpdateBrandAsync(Brand brand);
        Task DeleteBrandAsync(int id);
        Task<IEnumerable<Brand>> SearchByBrandNameAsync(string brandName);
        Task<bool> ExistsAsync(int id);
    }
} 