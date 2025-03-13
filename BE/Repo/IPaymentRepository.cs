using Data.Models;

namespace Repo
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<Payment?> GetByOrderIdAsync(int orderId);
        Task<Payment?> GetPaymentByOrderCodeAsync(int orderCode);
        Task AddAsync(Payment payment);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(int id);
        Task AddPaymentHistoryAsync(PaymentHistory history);
    }
}
