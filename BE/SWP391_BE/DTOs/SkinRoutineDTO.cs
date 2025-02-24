namespace SWP391_BE.DTOs
{
    public class SkinRoutineDTO
    {
        public int RoutineId { get; set; }
        public int SkinTypeId { get; set; }
        public string RoutineStep { get; set; } = null!;
        public string? SkinTypeName { get; set; }
    }

    public class CreateSkinRoutineDTO
    {
        public int SkinTypeId { get; set; }
        public string RoutineStep { get; set; } = null!;
    }

    public class UpdateSkinRoutineDTO
    {
        public string RoutineStep { get; set; } = null!;
    }
} 