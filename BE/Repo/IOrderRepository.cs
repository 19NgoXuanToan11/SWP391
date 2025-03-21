using Data.Models;

namespace Repo
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(int id);
        Task AddAsync(Order order);
        Task UpdateAsync(Order order);
        Task DeleteAsync(int id);
        Task UpdateOrderStatusAsync(int id, string status);
        Task<bool> OrderExistsAsync(int id);
    }
}
