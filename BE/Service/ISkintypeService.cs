using Data.Models;

namespace Service
{
    public interface ISkinTypeService
    {
        Task<IEnumerable<Skintype>> GetAllSkinTypesAsync();
        Task<Skintype?> GetSkinTypeByIdAsync(int id);
        Task AddSkinTypeAsync(Skintype skinType);
        Task UpdateSkinTypeAsync(Skintype skinType);
        Task DeleteSkinTypeAsync(int id);
    }
}
