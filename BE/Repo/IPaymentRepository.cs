using Data.Models;

namespace Repo
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
<<<<<<< Updated upstream
        Task<Payment?> GetByOrderIdAsync(int orderId);
        Task AddAsync(Payment payment);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(int id);
        Task AddPaymentHistoryAsync(PaymentHistory history);
=======
        Task AddAsync(Payment payment);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(int id);
>>>>>>> Stashed changes
    }
}
