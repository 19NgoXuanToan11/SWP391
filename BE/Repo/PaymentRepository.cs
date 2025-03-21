using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public PaymentRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _context.Payments.ToListAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments.FindAsync(id);
        }

        public async Task AddAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Payment payment)
        {
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment != null)
            {
                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Payment?> GetByOrderIdAsync(int orderId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId && p.Status == "PENDING");
        }

        public async Task AddPaymentHistoryAsync(PaymentHistory history)
        {
            await _context.PaymentHistories.AddAsync(history);
            await _context.SaveChangesAsync();
        }

        public async Task<Payment?> GetPaymentByOrderCodeAsync(int orderCode)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.OrderCode == orderCode);
        }

        public async Task<IEnumerable<Payment>> GetPaidPaymentsByUserIdAsync(int userId)
        {
            return await _context.Payments
                .Include(p => p.Order)
                    .ThenInclude(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                            .ThenInclude(p => p.Images)
                .Where(p => p.Order.UserId == userId && p.Status == "PAID")
                .ToListAsync();
        }
    }
}
