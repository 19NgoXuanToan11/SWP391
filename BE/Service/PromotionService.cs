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

        // L?y t?t c? khuy?n m�i
        public async Task<IEnumerable<Promotion>> GetAllPromotionsAsync()
        {
            return await _promotionRepository.GetAllAsync();
        }

        // L?y khuy?n m�i theo ID
        public async Task<Promotion?> GetByIdAsync(int id)
        {
            return await _promotionRepository.GetByIdAsync(id);
        }

        // L?y khuy?n m�i ?ang �p d?ng (cho ??n h�ng)
        public async Task<Promotion?> GetActivePromotionAsync()
        {
            return await _promotionRepository.GetActivePromotionAsync();
        }

        // Th�m khuy?n m�i
        public async Task AddPromotionAsync(Promotion promotion)
        {
            await _promotionRepository.AddAsync(promotion);
        }

        // C?p nh?t khuy?n m�i
        public async Task UpdatePromotionAsync(Promotion promotion)
        {
            await _promotionRepository.UpdateAsync(promotion);
        }

        // X�a khuy?n m�i
        public async Task DeletePromotionAsync(int id)
        {
            await _promotionRepository.DeleteAsync(id);
        }
    }
}
