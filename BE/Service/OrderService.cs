using Data.Models;
using Repo;

namespace Service
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }

        public async Task AddOrderAsync(Order order)
        {
            await _orderRepository.AddAsync(order);
        }

        public async Task UpdateOrderAsync(Order order)
        {
            await _orderRepository.UpdateAsync(order);
        }

        public async Task DeleteOrderAsync(int id)
        {
            await _orderRepository.DeleteAsync(id);
        }

        public async Task UpdateOrderStatusAsync(int id, string status)
        {
            await _orderRepository.UpdateOrderStatusAsync(id, status);
        }

        public async Task<bool> OrderExistsAsync(int id)
        {
            return await _orderRepository.OrderExistsAsync(id);
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _orderRepository.GetOrdersByUserIdAsync(userId);
        }
    }
}
