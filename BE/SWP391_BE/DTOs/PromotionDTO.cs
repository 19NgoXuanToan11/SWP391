namespace SWP391_BE.DTOs
{
    public class PromotionDTO
    {
        public int PromotionId { get; set; }
        public string? PromotionName { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class CreatePromotionDTO
    {
        public string? PromotionName { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class UpdatePromotionDTO
    {
        public string? PromotionName { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
} 