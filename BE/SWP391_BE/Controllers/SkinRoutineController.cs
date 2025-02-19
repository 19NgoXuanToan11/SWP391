using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkinRoutineController : ControllerBase
    {
        private readonly ISkinRoutineService _skinRoutineService;
        private readonly IMapper _mapper;

        public SkinRoutineController(ISkinRoutineService skinRoutineService, IMapper mapper)
        {
            _skinRoutineService = skinRoutineService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkinRoutineDTO>>> GetAllSkinRoutines()
        {
            var skinRoutines = await _skinRoutineService.GetAllSkinRoutinesAsync();
            return Ok(_mapper.Map<IEnumerable<SkinRoutineDTO>>(skinRoutines));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SkinRoutineDTO>> GetSkinRoutine(int id)
        {
            var skinRoutine = await _skinRoutineService.GetSkinRoutineByIdAsync(id);
            if (skinRoutine == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<SkinRoutineDTO>(skinRoutine));
        }

        [HttpPost]
        public async Task<ActionResult<SkinRoutineDTO>> CreateSkinRoutine(CreateSkinRoutineDTO createSkinRoutineDTO)
        {
            var skinRoutine = _mapper.Map<SkinRoutine>(createSkinRoutineDTO);
            await _skinRoutineService.AddSkinRoutineAsync(skinRoutine);
            return CreatedAtAction(nameof(GetSkinRoutine), new { id = skinRoutine.RoutineId }, 
                _mapper.Map<SkinRoutineDTO>(skinRoutine));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkinRoutine(int id, UpdateSkinRoutineDTO updateSkinRoutineDTO)
        {
            var existingSkinRoutine = await _skinRoutineService.GetSkinRoutineByIdAsync(id);
            if (existingSkinRoutine == null)
            {
                return NotFound();
            }

            _mapper.Map(updateSkinRoutineDTO, existingSkinRoutine);
            await _skinRoutineService.UpdateSkinRoutineAsync(existingSkinRoutine);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkinRoutine(int id)
        {
            var skinRoutine = await _skinRoutineService.GetSkinRoutineByIdAsync(id);
            if (skinRoutine == null)
            {
                return NotFound();
            }

            await _skinRoutineService.DeleteSkinRoutineAsync(id);
            return NoContent();
        }
    }
} 