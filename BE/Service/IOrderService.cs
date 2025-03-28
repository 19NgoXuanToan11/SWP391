using Data.Models;

namespace Service
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int id);
        Task AddOrderAsync(Order order);
        Task UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);
        Task UpdateOrderStatusAsync(int id, string status);
        Task<bool> OrderExistsAsync(int id);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId);
    }
}
