using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Repo
{
    public class RoleRepository : IRoleRepository
    {
        private readonly SkinCareManagementDbContext _context;

        public RoleRepository(SkinCareManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _context.Role
                .Include(r => r.Users)
                .ToListAsync();
        }

        public async Task<Role?> GetByIdAsync(int id)
        {
            return await _context.Role
                .Include(r => r.Users)
                .FirstOrDefaultAsync(r => r.RoleId == id);
        }

        public async Task AddAsync(Role role)
        {
            await _context.Role.AddAsync(role);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Role role)
        {
            _context.Role.Update(role);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var role = await _context.Role.FindAsync(id);
            if (role != null)
            {
                _context.Role.Remove(role);
                await _context.SaveChangesAsync();
            }
        }
    }
}
