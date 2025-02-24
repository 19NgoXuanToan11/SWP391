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
    public class SkinRoutineController : ControllerBase
    {
        private readonly ISkinRoutineService _skinRoutineService;
        private readonly IMapper _mapper;
        private readonly ILogger<SkinRoutineController> _logger;

        public SkinRoutineController(
            ISkinRoutineService skinRoutineService,
            IMapper mapper,
            ILogger<SkinRoutineController> logger)
        {
            _skinRoutineService = skinRoutineService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkinRoutineDTO>>> GetAllSkinRoutines()
        {
            try
            {
                var skinRoutines = await _skinRoutineService.GetAllSkinRoutinesAsync();
                if (!skinRoutines.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<SkinRoutineDTO>>(skinRoutines));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all skin routines");
                return StatusCode(500, "An error occurred while retrieving skin routines");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SkinRoutineDTO>> GetSkinRoutine(int id)
        {
            try
            {
                var skinRoutine = await _skinRoutineService.GetSkinRoutineByIdAsync(id);
                if (skinRoutine == null)
                {
                    return NotFound($"Skin routine with ID {id} not found");
                }
                return Ok(_mapper.Map<SkinRoutineDTO>(skinRoutine));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving skin routine {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the skin routine");
            }
        }

        [HttpGet("skintype/{skinTypeId}")]
        public async Task<ActionResult<IEnumerable<SkinRoutineDTO>>> GetSkinRoutinesBySkinType(int skinTypeId)
        {
            try
            {
                var skinRoutines = await _skinRoutineService.GetAllSkinRoutinesAsync();
                var filteredRoutines = skinRoutines.Where(sr => sr.SkinTypeId == skinTypeId);
                
                if (!filteredRoutines.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<SkinRoutineDTO>>(filteredRoutines));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving skin routines for skin type {SkinTypeId}", skinTypeId);
                return StatusCode(500, "An error occurred while retrieving skin routines");
            }
        }

        [HttpPost]
        public async Task<ActionResult<SkinRoutineDTO>> CreateSkinRoutine(CreateSkinRoutineDTO createSkinRoutineDTO)
        {
            try
            {
                if (createSkinRoutineDTO == null)
                {
                    return BadRequest("Skin routine data is required");
                }

                var skinRoutine = _mapper.Map<SkinRoutine>(createSkinRoutineDTO);
                await _skinRoutineService.AddSkinRoutineAsync(skinRoutine);

                var createdSkinRoutineDto = _mapper.Map<SkinRoutineDTO>(skinRoutine);
                return CreatedAtAction(
                    nameof(GetSkinRoutine),
                    new { id = skinRoutine.RoutineId },
                    createdSkinRoutineDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating skin routine");
                return StatusCode(500, "An error occurred while creating the skin routine");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkinRoutine(int id, UpdateSkinRoutineDTO updateSkinRoutineDTO)
        {
            try
            {
                if (updateSkinRoutineDTO == null)
                {
                    return BadRequest("Skin routine update data is required");
                }

                var existingSkinRoutine = await _skinRoutineService.GetSkinRoutineByIdAsync(id);
                if (existingSkinRoutine == null)
                {
                    return NotFound($"Skin routine with ID {id} not found");
                }

                _mapper.Map(updateSkinRoutineDTO, existingSkinRoutine);
                await _skinRoutineService.UpdateSkinRoutineAsync(existingSkinRoutine);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating skin routine {Id}", id);
                return StatusCode(500, "An error occurred while updating the skin routine");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkinRoutine(int id)
        {
            try
            {
                var skinRoutine = await _skinRoutineService.GetSkinRoutineByIdAsync(id);
                if (skinRoutine == null)
                {
                    return NotFound($"Skin routine with ID {id} not found");
                }

                await _skinRoutineService.DeleteSkinRoutineAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting skin routine {Id}", id);
                return StatusCode(500, "An error occurred while deleting the skin routine");
            }
        }
    }
} 