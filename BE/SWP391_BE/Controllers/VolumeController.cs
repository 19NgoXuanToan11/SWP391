using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;
using Microsoft.Extensions.Logging;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VolumeController : ControllerBase
    {
        private readonly IVolumeService _volumeService;
        private readonly IMapper _mapper;
        private readonly ILogger<VolumeController> _logger;

        public VolumeController(
            IVolumeService volumeService,
            IMapper mapper,
            ILogger<VolumeController> logger)
        {
            _volumeService = volumeService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VolumeDTO>>> GetAllVolumes()
        {
            try
            {
                var volumes = await _volumeService.GetAllVolumesAsync();
                if (!volumes.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<VolumeDTO>>(volumes));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all volumes");
                return StatusCode(500, "An error occurred while retrieving volumes");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VolumeDTO>> GetVolume(int id)
        {
            try
            {
                var volume = await _volumeService.GetVolumeByIdAsync(id);
                if (volume == null)
                {
                    return NotFound($"Volume with ID {id} not found");
                }
                return Ok(_mapper.Map<VolumeDTO>(volume));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving volume {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the volume");
            }
        }

        [HttpPost]
        public async Task<ActionResult<VolumeDTO>> CreateVolume(CreateVolumeDTO createVolumeDTO)
        {
            try
            {
                if (createVolumeDTO == null)
                {
                    return BadRequest("Volume data is required");
                }

                var volume = _mapper.Map<Volume>(createVolumeDTO);
                await _volumeService.AddVolumeAsync(volume);

                var createdVolumeDto = _mapper.Map<VolumeDTO>(volume);
                return CreatedAtAction(
                    nameof(GetVolume),
                    new { id = volume.VolumeId },
                    createdVolumeDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating volume");
                return StatusCode(500, "An error occurred while creating the volume");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVolume(int id, UpdateVolumeDTO updateVolumeDTO)
        {
            try
            {
                if (updateVolumeDTO == null)
                {
                    return BadRequest("Volume update data is required");
                }

                var existingVolume = await _volumeService.GetVolumeByIdAsync(id);
                if (existingVolume == null)
                {
                    return NotFound($"Volume with ID {id} not found");
                }

                _mapper.Map(updateVolumeDTO, existingVolume);
                await _volumeService.UpdateVolumeAsync(existingVolume);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating volume {Id}", id);
                return StatusCode(500, "An error occurred while updating the volume");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVolume(int id)
        {
            try
            {
                var volume = await _volumeService.GetVolumeByIdAsync(id);
                if (volume == null)
                {
                    return NotFound($"Volume with ID {id} not found");
                }

                await _volumeService.DeleteVolumeAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting volume {Id}", id);
                return StatusCode(500, "An error occurred while deleting the volume");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<VolumeDTO>>> SearchVolumes([FromQuery] string value)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    return BadRequest("Volume value is required for search");
                }

                var volumes = await _volumeService.SearchByValueAsync(value);
                if (!volumes.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<VolumeDTO>>(volumes));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching volumes with value {Value}", value);
                return StatusCode(500, "An error occurred while searching volumes");
            }
        }
    }
} 