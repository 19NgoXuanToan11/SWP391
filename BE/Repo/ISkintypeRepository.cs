using Data.Models;

namespace Repo
{
    public interface ISkinTypeRepository
    {
        Task<IEnumerable<Skintype>> GetAllAsync();
        Task<Skintype?> GetByIdAsync(int id);
        Task AddAsync(Skintype skintype);
        Task UpdateAsync(Skintype skintype);
        Task DeleteAsync(int id);
    }
}
