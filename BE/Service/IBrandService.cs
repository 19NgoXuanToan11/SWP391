namespace Service
{
    public interface IBrandService
    {
        Task<bool> ExistsAsync(int id);
    }
} 