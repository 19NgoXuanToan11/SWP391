using Data.Models;

namespace Repo
{
    public interface IVolumeRepository
    {
        Task<IEnumerable<Volume>> GetAllAsync();
        Task<Volume?> GetByIdAsync(int id);
        Task AddAsync(Volume volume);
        Task UpdateAsync(Volume volume);
        Task DeleteAsync(int id);
        Task<IEnumerable<Volume>> SearchByValueAsync(string value);
    }
} 