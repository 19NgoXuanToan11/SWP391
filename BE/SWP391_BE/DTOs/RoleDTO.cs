using System.ComponentModel.DataAnnotations;

namespace SWP391_BE.DTOs
{
    public class RoleDTO
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;
    }

    public class CreateRoleDTO
    {
        [Required(ErrorMessage = "Tên vai trò không được để trống")]
        [StringLength(50, ErrorMessage = "Tên vai trò không được vượt quá 50 ký tự")]
        public string RoleName { get; set; } = null!;
    }

    public class UpdateRoleDTO
    {
        [Required(ErrorMessage = "Tên vai trò không được để trống")]
        [StringLength(50, ErrorMessage = "Tên vai trò không được vượt quá 50 ký tự")]
        public string RoleName { get; set; } = null!;
    }
} 