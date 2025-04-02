using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class OrderRepository : IOrderRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public OrderRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders.ToListAsync();
        }
        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);
        }

        public async Task AddAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateOrderStatusAsync(int id, string status)
        {
            // Use direct database query to update only the Status column
            // This avoids loading the entity and any related entities completely
            await _context.Database.ExecuteSqlRawAsync(
                "UPDATE Orders SET Status = {0} WHERE OrderId = {1}", 
                status, id);
        }

        public async Task<bool> OrderExistsAsync(int id)
        {
            return await _context.Orders.AnyAsync(o => o.OrderId == id);
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Select(o => new Order
                {
                    OrderId = o.OrderId,
                    Status = o.Status,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    PaymentMethod = o.PaymentMethod
                })
                .ToListAsync();
        }
    }
}
