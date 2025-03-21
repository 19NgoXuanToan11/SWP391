using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;
        private readonly SkinCareManagementDbContext _context;

        public UserService(
            IUserRepository userRepository,
            ILogger<UserService> logger,
            SkinCareManagementDbContext context)
        {
            _userRepository = userRepository;
            _logger = logger;
            _context = context;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Users.AnyAsync(u => u.UserId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if user exists with ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            try
            {
                _logger.LogInformation("Starting to retrieve all users");
                
                // First check if we can connect to the database
                if (!await _context.Database.CanConnectAsync())
                {
                    throw new Exception("Cannot connect to database");
                }

                // Check if Users table exists and has data
                var userCount = await _context.Users.CountAsync();
                _logger.LogInformation("Found {Count} users in database", userCount);

                var users = await _userRepository.GetAllAsync();
                _logger.LogInformation("Successfully retrieved {Count} users from repository", users.Count());
                
                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users. Exception details: {Message}, Stack trace: {StackTrace}", 
                    ex.Message, ex.StackTrace);

                if (ex.InnerException != null)
                {
                    _logger.LogError("Inner exception: {Message}, Stack trace: {StackTrace}",
                        ex.InnerException.Message, ex.InnerException.StackTrace);
                }

                throw new Exception($"Error retrieving users: {ex.Message}", ex);
            }
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Getting user with ID: {Id}", id);
                return await _userRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user with ID {Id}", id);
                throw;
            }
        }

        public async Task AddUserAsync(User user)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                // Validate role
                var role = await _context.Roles.FindAsync(user.RoleId);
                if (role == null)
                {
                    throw new InvalidOperationException($"Role with ID {user.RoleId} does not exist");
                }

                // Check if username already exists
                if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                {
                    throw new InvalidOperationException($"Username '{user.Username}' is already taken");
                }

                // Check if email already exists
                if (!string.IsNullOrEmpty(user.Email) && await _context.Users.AnyAsync(u => u.Email == user.Email))
                {
                    throw new InvalidOperationException($"Email '{user.Email}' is already registered");
                }

                user.CreatedAt = DateTime.UtcNow;
                await _userRepository.AddAsync(user);
                _logger.LogInformation("User created successfully: {Username}", user.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding user: {Username}", user?.Username);
                throw;
            }
        }

        public async Task UpdateUserAsync(User user)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                await _userRepository.UpdateAsync(user);
                _logger.LogInformation("User updated successfully: {UserId}", user.UserId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: {UserId}", user?.UserId);
                throw;
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            try
            {
                await _userRepository.DeleteAsync(id);
                _logger.LogInformation("User deleted successfully: {UserId}", id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user with ID {Id}", id);
                throw;
            }
        }
    }
}
