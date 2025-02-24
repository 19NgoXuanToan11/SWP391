using Data.Models;

namespace Repo
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task AddAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(int id);
        Task<IEnumerable<Category>> SearchByCategoryNameAsync(string categoryName);
    }
} 