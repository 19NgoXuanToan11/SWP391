using Data.Models;

namespace Repo
{
    public interface ISkinTypeRepository
    {
        Task<IEnumerable<Skintype>> GetAllAsync();
        Task<Skintype?> GetByIdAsync(int id);
        Task AddAsync(Skintype skinType);
        Task UpdateAsync(Skintype skinType);
        Task DeleteAsync(int id);
    }
}
