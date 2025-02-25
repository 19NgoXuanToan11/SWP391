using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public UserRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.User
                .Include(u => u.Role)
                .Include(u => u.Orders)
                .Include(u => u.Feedbacks)
                .ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.User
                .Include(u => u.Role)
                .Include(u => u.Orders)
                .Include(u => u.Feedbacks)
                .FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task AddAsync(User user)
        {
            await _context.User.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.User.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user != null)
            {
                _context.User.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}
