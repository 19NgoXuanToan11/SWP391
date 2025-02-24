using System.ComponentModel.DataAnnotations;

namespace SWP391_BE.DTOs
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public string? MainIngredients { get; set; }

        public int? BrandId { get; set; }
        public int? VolumeId { get; set; }
        public int? SkinTypeId { get; set; }
        public int? CategoryId { get; set; }

        public DateTime? CreatedAt { get; set; }

        // Navigation properties
        public string? BrandName { get; set; }
        public string? VolumeName { get; set; }
        public string? SkinTypeName { get; set; }
        public string? CategoryName { get; set; }
        public ICollection<string> ImageUrls { get; set; } = new List<string>();
    }

    public class CreateProductDTO
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [StringLength(200, ErrorMessage = "Tên sản phẩm không được vượt quá 200 ký tự")]
        public string ProductName { get; set; } = null!;

        [StringLength(2000, ErrorMessage = "Mô tả không được vượt quá 2000 ký tự")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Giá tiền không được để trống")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá tiền phải lớn hơn 0")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn hoặc bằng 0")]
        public int? Stock { get; set; }

        public string? MainIngredients { get; set; }

        [Required(ErrorMessage = "Thương hiệu không được để trống")]
        public int? BrandId { get; set; }

        [Required(ErrorMessage = "Thể tích không được để trống")]
        public int? VolumeId { get; set; }

        [Required(ErrorMessage = "Loại da không được để trống")]
        public int? SkinTypeId { get; set; }

        [Required(ErrorMessage = "Danh mục không được để trống")]
        public int? CategoryId { get; set; }

        [MinLength(1, ErrorMessage = "Sản phẩm phải có ít nhất 1 hình ảnh")]
        public List<string> ImageUrls { get; set; } = new List<string>();
    }

    public class UpdateProductDTO
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        [StringLength(200)]
        public string ProductName { get; set; } = null!;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int? Stock { get; set; }

        public string? MainIngredients { get; set; }

        [Required]
        public int? BrandId { get; set; }

        [Required]
        public int? VolumeId { get; set; }

        [Required]
        public int? SkinTypeId { get; set; }

        [Required]
        public int? CategoryId { get; set; }

        [MinLength(1)]
        public List<string> ImageUrls { get; set; } = new List<string>();
    }
}