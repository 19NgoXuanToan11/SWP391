using System.ComponentModel.DataAnnotations;

namespace SWP391_BE.DTOs
{
    public class ProductImageDTO
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int ProductId { get; set; }
    }

    public class CreateProductImageDTO
    {
        [Required(ErrorMessage = "URL hình ảnh không được để trống")]
        [Url(ErrorMessage = "URL hình ảnh không hợp lệ")]
        public string ImageUrl { get; set; } = null!;

        [Required(ErrorMessage = "ID sản phẩm không được để trống")]
        public int ProductId { get; set; }
    }

    public class UpdateProductImageDTO
    {
        [Required(ErrorMessage = "URL hình ảnh không được để trống")]
        [Url(ErrorMessage = "URL hình ảnh không hợp lệ")]
        public string ImageUrl { get; set; } = null!;
    }
} 