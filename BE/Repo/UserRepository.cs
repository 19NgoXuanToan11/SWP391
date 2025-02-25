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
            try
            {
                return await _context.Users
                    .Include(u => u.Role)
                    .AsNoTracking()
                    .Select(u => new User
                    {
                        UserId = u.UserId,
                        RoleId = u.RoleId,
                        Username = u.Username,
                        FullName = u.FullName,
                        Email = u.Email,
                        PhoneNumber = u.PhoneNumber,
                        Address = u.Address,
                        IsVerification = u.IsVerification,
                        IsBanned = u.IsBanned,
                        CreatedAt = u.CreatedAt,
                        Role = new Role 
                        { 
                            RoleId = u.Role.RoleId,
                            RoleName = u.Role.RoleName
                        }
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve users from database. Error: {ex.Message}", ex);
            }
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Users
                    .Include(u => u.Role)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.UserId == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve user with ID {id}. Error: {ex.Message}", ex);
            }
        }

        public async Task AddAsync(User user)
        {
            try
            {
                // Verify role exists
                if (!await _context.Roles.AnyAsync(r => r.RoleId == user.RoleId))
                {
                    throw new Exception($"Role with ID {user.RoleId} does not exist");
                }

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to add user: {ex.Message}", ex);
            }
        }

        public async Task UpdateAsync(User user)
        {
            try
            {
                // Verify role exists
                if (!await _context.Roles.AnyAsync(r => r.RoleId == user.RoleId))
                {
                    throw new Exception($"Role with ID {user.RoleId} does not exist");
                }

                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to update user: {ex.Message}", ex);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user != null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete user: {ex.Message}", ex);
            }
        }
    }
}
