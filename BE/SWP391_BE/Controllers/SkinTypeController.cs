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
    public class SkinTypeController : ControllerBase
    {
        private readonly ISkinTypeService _skinTypeService;
        private readonly IMapper _mapper;
        private readonly ILogger<SkinTypeController> _logger;

        public SkinTypeController(
            ISkinTypeService skinTypeService,
            IMapper mapper,
            ILogger<SkinTypeController> logger)
        {
            _skinTypeService = skinTypeService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkinTypeDTO>>> GetAllSkinTypes()
        {
            try
            {
                var skinTypes = await _skinTypeService.GetAllSkinTypesAsync();
                if (!skinTypes.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<SkinTypeDTO>>(skinTypes));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all skin types");
                return StatusCode(500, "An error occurred while retrieving skin types");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SkinTypeDTO>> GetSkinType(int id)
        {
            try
            {
                var skinType = await _skinTypeService.GetSkinTypeByIdAsync(id);
                if (skinType == null)
                {
                    return NotFound($"Skin type with ID {id} not found");
                }
                return Ok(_mapper.Map<SkinTypeDTO>(skinType));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving skin type {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the skin type");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SkinTypeDTO>> CreateSkinType(CreateSkinTypeDTO createSkinTypeDTO)
        {
            try
            {
                if (createSkinTypeDTO == null)
                {
                    return BadRequest("Skin type data is required");
                }

                var skinType = _mapper.Map<Skintype>(createSkinTypeDTO);
                await _skinTypeService.AddSkinTypeAsync(skinType);

                var createdSkinTypeDto = _mapper.Map<SkinTypeDTO>(skinType);
                return CreatedAtAction(
                    nameof(GetSkinType),
                    new { id = skinType.SkinTypeId },
                    createdSkinTypeDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating skin type");
                return StatusCode(500, "An error occurred while creating the skin type");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkinType(int id, UpdateSkinTypeDTO updateSkinTypeDTO)
        {
            try
            {
                if (updateSkinTypeDTO == null)
                {
                    return BadRequest("Skin type update data is required");
                }

                var existingSkinType = await _skinTypeService.GetSkinTypeByIdAsync(id);
                if (existingSkinType == null)
                {
                    return NotFound($"Skin type with ID {id} not found");
                }

                _mapper.Map(updateSkinTypeDTO, existingSkinType);
                await _skinTypeService.UpdateSkinTypeAsync(existingSkinType);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating skin type {Id}", id);
                return StatusCode(500, "An error occurred while updating the skin type");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkinType(int id)
        {
            try
            {
                var skinType = await _skinTypeService.GetSkinTypeByIdAsync(id);
                if (skinType == null)
                {
                    return NotFound($"Skin type with ID {id} not found");
                }

                await _skinTypeService.DeleteSkinTypeAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting skin type {Id}", id);
                return StatusCode(500, "An error occurred while deleting the skin type");
            }
        }
    }
} 