using Data.Models;
using Repo;

namespace Service
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository _promotionRepository;

        public PromotionService(IPromotionRepository promotionRepository)
        {
            _promotionRepository = promotionRepository;
        }

        public async Task<IEnumerable<Promotion>> GetAllPromotionsAsync()
        {
            return await _promotionRepository.GetAllAsync();
        }

        public async Task<Promotion?> GetPromotionByIdAsync(int id)
        {
            return await _promotionRepository.GetByIdAsync(id);
        }

        public async Task AddPromotionAsync(Promotion promotion)
        {
            await _promotionRepository.AddAsync(promotion);
        }

        public async Task UpdatePromotionAsync(Promotion promotion)
        {
            await _promotionRepository.UpdateAsync(promotion);
        }

        public async Task DeletePromotionAsync(int id)
        {
            await _promotionRepository.DeleteAsync(id);
        }
    }
}
