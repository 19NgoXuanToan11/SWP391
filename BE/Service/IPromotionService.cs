using Data.Models;

namespace Service
{
    public interface IPromotionService
    {
        // L?y t?t c? khuy?n mãi
        Task<IEnumerable<Promotion>> GetAllPromotionsAsync();

        // L?y khuy?n mãi theo ID
        Task<Promotion?> GetPromotionByIdAsync(int id);

        // L?y khuy?n mãi ?ang áp d?ng (cho ??n hàng)
        Task<Promotion?> GetActivePromotionAsync();

        // Thêm khuy?n mãi
        Task AddPromotionAsync(Promotion promotion);

        // C?p nh?t khuy?n mãi
        Task UpdatePromotionAsync(Promotion promotion);

        // Xóa khuy?n mãi
        Task DeletePromotionAsync(int id);
    }
}
