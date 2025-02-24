using Data.Models;

namespace Service
{
    public interface ISkinTypeService
    {
        Task<IEnumerable<SkinType>> GetAllSkintypesAsync();
        Task<SkinType?> GetSkintypeByIdAsync(int id);
        Task AddSkintypeAsync(SkinType skintype);
        Task UpdateSkintypeAsync(SkinType skintype);
        Task DeleteSkintypeAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
