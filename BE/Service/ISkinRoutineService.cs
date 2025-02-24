using Data.Models;

namespace Service
{
    public interface ISkinRoutineService
    {
        Task<IEnumerable<SkinRoutine>> GetAllSkinRoutinesAsync();
        Task<SkinRoutine?> GetSkinRoutineByIdAsync(int id);
        Task AddSkinRoutineAsync(SkinRoutine skinRoutine);
        Task UpdateSkinRoutineAsync(SkinRoutine skinRoutine);
        Task DeleteSkinRoutineAsync(int id);
    }
}
