using Data.Models;

namespace Repo
{
    public interface ISkinTypeRepository
    {
        Task<IEnumerable<SkinType>> GetAllAsync();
        Task<SkinType?> GetByIdAsync(int id);
        Task AddAsync(SkinType skintype);
        Task UpdateAsync(SkinType skintype);
        Task DeleteAsync(int id);
    }
}
