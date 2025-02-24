using Data.Models;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class VolumeService : IVolumeService
    {
        private readonly IVolumeRepository _volumeRepository;
        private readonly ILogger<VolumeService> _logger;

        public VolumeService(IVolumeRepository volumeRepository, ILogger<VolumeService> logger)
        {
            _volumeRepository = volumeRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Volume>> GetAllVolumesAsync()
        {
            try
            {
                return await _volumeRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all volumes");
                throw;
            }
        }

        public async Task<Volume?> GetVolumeByIdAsync(int id)
        {
            try
            {
                return await _volumeRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting volume with ID {Id}", id);
                throw;
            }
        }

        public async Task AddVolumeAsync(Volume volume)
        {
            try
            {
                if (volume == null)
                    throw new ArgumentNullException(nameof(volume));

                await _volumeRepository.AddAsync(volume);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding volume: {VolumeSize}", volume?.VolumeSize);
                throw;
            }
        }

        public async Task UpdateVolumeAsync(Volume volume)
        {
            try
            {
                if (volume == null)
                    throw new ArgumentNullException(nameof(volume));

                await _volumeRepository.UpdateAsync(volume);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating volume: {VolumeId}", volume?.VolumeId);
                throw;
            }
        }

        public async Task DeleteVolumeAsync(int id)
        {
            try
            {
                await _volumeRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting volume with ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Volume>> SearchByValueAsync(string value)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Volume size cannot be empty", nameof(value));

                return await _volumeRepository.SearchByValueAsync(value);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching volumes by value: {VolumeSize}", value);
                throw;
            }
        }
    }
} 