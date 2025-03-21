namespace SWP391_BE.DTOs
{
    public class BrandDTO
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; } = null!;
        public string? Description { get; set; }
    }

    public class CreateBrandDTO
    {
        public string BrandName { get; set; } = null!;
        public string? Description { get; set; }
    }

    public class UpdateBrandDTO
    {
        public string BrandName { get; set; } = null!;
        public string? Description { get; set; }
    }
} 