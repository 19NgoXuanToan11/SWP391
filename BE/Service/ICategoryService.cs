namespace Service
{
    public interface ICategoryService
    {
        Task<bool> ExistsAsync(int id);
    }
} 