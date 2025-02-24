namespace SWP391_BE.DTOs
{
    public class SkinTypeDTO
    {
        public int SkinTypeId { get; set; }
        public string SkinTypeName { get; set; } = null!;
    }

    public class CreateSkinTypeDTO
    {
        public string SkinTypeName { get; set; } = null!;
    }

    public class UpdateSkinTypeDTO
    {
        public string SkinTypeName { get; set; } = null!;
    }
} 