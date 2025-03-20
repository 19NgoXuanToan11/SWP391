using Data.Models;

namespace Repo
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetAllAsync();
        Task<Brand?> GetByIdAsync(int id);
        Task AddAsync(Brand brand);
        Task UpdateAsync(Brand brand);
        Task DeleteAsync(int id);
        Task<IEnumerable<Brand>> SearchByBrandNameAsync(string brandName);
    }
} 