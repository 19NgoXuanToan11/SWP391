using Data.Models;

namespace Repo
{
    public interface ISkinRoutineRepository
    {
        Task<IEnumerable<SkinRoutine>> GetAllAsync();
        Task<SkinRoutine?> GetByIdAsync(int id);
        Task AddAsync(SkinRoutine skinRoutine);
        Task UpdateAsync(SkinRoutine skinRoutine);
        Task DeleteAsync(int id);
    }
}
