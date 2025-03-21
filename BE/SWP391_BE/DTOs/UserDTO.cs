namespace SWP391_BE.DTOs
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string Username { get; set; } = null!;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public bool IsVerification { get; set; }
        public bool IsBanned { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateUserDTO
    {
        public int RoleId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
    }

    public class UpdateUserDTO
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public bool IsVerification { get; set; }
        public bool IsBanned { get; set; }
    }
} 