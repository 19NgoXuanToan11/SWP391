using Data.Models;

namespace Service
{
    public interface ISkintypeService
    {
        Task<IEnumerable<Skintype>> GetAllSkintypesAsync();
        Task<Skintype?> GetSkintypeByIdAsync(int id);
        Task AddSkintypeAsync(Skintype skintype);
        Task UpdateSkintypeAsync(Skintype skintype);
        Task DeleteSkintypeAsync(int id);
    }
}
