using System.ComponentModel.DataAnnotations;

namespace SWP391_BE.DTOs
{
    public class VolumeDTO
    {
        public int VolumeId { get; set; }
        public string VolumeSize { get; set; } = null!;
    }

    public class CreateVolumeDTO
    {
        [Required(ErrorMessage = "Giá trị thể tích không được để trống")]
        [StringLength(50, ErrorMessage = "Giá trị thể tích không được vượt quá 50 ký tự")]
        [RegularExpression(@"^\d+\s*(ml|g|oz|kg)$", ErrorMessage = "Giá trị thể tích không hợp lệ (ví dụ: 100ml, 50g)")]
        public string VolumeSize { get; set; } = null!;
    }

    public class UpdateVolumeDTO
    {
        [Required(ErrorMessage = "Giá trị thể tích không được để trống")]
        [StringLength(50, ErrorMessage = "Giá trị thể tích không được vượt quá 50 ký tự")]
        [RegularExpression(@"^\d+\s*(ml|g|oz|kg)$", ErrorMessage = "Giá trị thể tích không hợp lệ (ví dụ: 100ml, 50g)")]
        public string VolumeSize { get; set; } = null!;
    }
} 