namespace SWP391_BE.DTOs
{
    public class SkintypeDTO
    {
        public int SkinTypeId { get; set; }
        public string SkinTypeName { get; set; } = null!;
    }

    public class CreateSkintypeDTO
    {
        public string SkinTypeName { get; set; } = null!;
    }

    public class UpdateSkintypeDTO
    {
        public string SkinTypeName { get; set; } = null!;
    }
} 