namespace SWP391_BE.DTOs
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public int? SkinTypeId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateProductDTO
    {
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public int? SkinTypeId { get; set; }
    }

    public class UpdateProductDTO
    {
        public string ProductName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? Stock { get; set; }
        public int? SkinTypeId { get; set; }
    }
} 