namespace SWP391_BE.DTOs
{
    public class FeedbackDTO
    {
        public int FeedbackId { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? ProductName { get; set; }
        public string? UserName { get; set; }
    }

    public class CreateFeedbackDTO
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class UpdateFeedbackDTO
    {
        public int? Rating { get; set; }
        public string? Comment { get; set; }
    }
} 