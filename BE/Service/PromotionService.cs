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

        // L?y t?t c? khuy?n mãi
        public async Task<IEnumerable<Promotion>> GetAllPromotionsAsync()
        {
            return await _promotionRepository.GetAllAsync();
        }

        // L?y khuy?n mãi theo ID
        public async Task<Promotion?> GetPromotionByIdAsync(int id)
        {
            return await _promotionRepository.GetByIdAsync(id);
        }

        // L?y khuy?n mãi ?ang áp d?ng (cho ??n hàng)
        public async Task<Promotion?> GetActivePromotionAsync()
        {
            return await _promotionRepository.GetActivePromotionAsync();
        }

        // Thêm khuy?n mãi
        public async Task AddPromotionAsync(Promotion promotion)
        {
            await _promotionRepository.AddAsync(promotion);
        }

        // C?p nh?t khuy?n mãi
        public async Task UpdatePromotionAsync(Promotion promotion)
        {
            await _promotionRepository.UpdateAsync(promotion);
        }

        // Xóa khuy?n mãi
        public async Task DeletePromotionAsync(int id)
        {
            await _promotionRepository.DeleteAsync(id);
        }
    }
}
