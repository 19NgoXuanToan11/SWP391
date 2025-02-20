namespace Service
{
    public interface IVolumeService
    {
        Task<bool> ExistsAsync(int id);
    }
} 