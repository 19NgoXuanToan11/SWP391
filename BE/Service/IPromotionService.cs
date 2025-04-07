using Data.Models;

namespace Service
{
    public interface IPromotionService
    {
        // L?y t?t c? khuy?n m�i
        Task<IEnumerable<Promotion>> GetAllPromotionsAsync();

        // L?y khuy?n m�i theo ID
        Task<Promotion?> GetByIdAsync(int id);

        // L?y khuy?n m�i ?ang �p d?ng (cho ??n h�ng)
        Task<Promotion?> GetActivePromotionAsync();

        // Th�m khuy?n m�i
        Task AddPromotionAsync(Promotion promotion);

        // C?p nh?t khuy?n m�i
        Task UpdatePromotionAsync(Promotion promotion);

        // X�a khuy?n m�i
        Task DeletePromotionAsync(int id);
    }
}
