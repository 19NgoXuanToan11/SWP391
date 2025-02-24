using Data.Models;

namespace Service
{
    public interface IVolumeService
    {
        Task<IEnumerable<Volume>> GetAllVolumesAsync();
        Task<Volume?> GetVolumeByIdAsync(int id);
        Task AddVolumeAsync(Volume volume);
        Task UpdateVolumeAsync(Volume volume);
        Task DeleteVolumeAsync(int id);
        Task<IEnumerable<Volume>> SearchByValueAsync(string value);
    }
} 