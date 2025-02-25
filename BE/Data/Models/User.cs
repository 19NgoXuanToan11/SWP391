using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Users")]
public partial class User
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string PasswordHash { get; set; } = null!; // Đổi từ Password sang PasswordHash

    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }
    public bool IsVerification { get; set; } // Thêm trạng thái xác thực

    public bool IsBanned { get; set; } // Trạng thái tài khoản bị khóa hay không

    public string? ExpirationToken { get; set; } // Token để xác thực tài khoản

    public string? VerificationToken { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Role Role { get; set; } = null!;
}
