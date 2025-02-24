using Data.Models;
using Repo;

namespace Service
{
    public class SkinRoutineService : ISkinRoutineService
    {
        private readonly ISkinRoutineRepository _skinRoutineRepository;

        public SkinRoutineService(ISkinRoutineRepository skinRoutineRepository)
        {
            _skinRoutineRepository = skinRoutineRepository;
        }

        public async Task<IEnumerable<SkinRoutine>> GetAllSkinRoutinesAsync()
        {
            return await _skinRoutineRepository.GetAllAsync();
        }

        public async Task<SkinRoutine?> GetSkinRoutineByIdAsync(int id)
        {
            return await _skinRoutineRepository.GetByIdAsync(id);
        }

        public async Task AddSkinRoutineAsync(SkinRoutine skinRoutine)
        {
            await _skinRoutineRepository.AddAsync(skinRoutine);
        }

        public async Task UpdateSkinRoutineAsync(SkinRoutine skinRoutine)
        {
            await _skinRoutineRepository.UpdateAsync(skinRoutine);
        }

        public async Task DeleteSkinRoutineAsync(int id)
        {
            await _skinRoutineRepository.DeleteAsync(id);
        }
    }
}
