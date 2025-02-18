using Data.Models;
using Repo;

namespace Service
{
    public class SkintypeService : ISkintypeService
    {
        private readonly ISkintypeRepository _skintypeRepository;

        public SkintypeService(ISkintypeRepository skintypeRepository)
        {
            _skintypeRepository = skintypeRepository;
        }

        public async Task<IEnumerable<Skintype>> GetAllSkintypesAsync()
        {
            return await _skintypeRepository.GetAllAsync();
        }

        public async Task<Skintype?> GetSkintypeByIdAsync(int id)
        {
            return await _skintypeRepository.GetByIdAsync(id);
        }

        public async Task AddSkintypeAsync(Skintype skintype)
        {
            await _skintypeRepository.AddAsync(skintype);
        }

        public async Task UpdateSkintypeAsync(Skintype skintype)
        {
            await _skintypeRepository.UpdateAsync(skintype);
        }

        public async Task DeleteSkintypeAsync(int id)
        {
            await _skintypeRepository.DeleteAsync(id);
        }
    }
}
