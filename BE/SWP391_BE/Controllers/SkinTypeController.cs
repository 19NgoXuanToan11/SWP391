using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkinTypeController : ControllerBase
    {
        private readonly ISkinTypeService _skinTypeService;
        private readonly IMapper _mapper;

        public SkinTypeController(ISkinTypeService skinTypeService, IMapper mapper)
        {
            _skinTypeService = skinTypeService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkintypeDTO>>> GetAllSkintypes()
        {
            var skintypes = await _skinTypeService.GetAllSkintypesAsync();
            return Ok(_mapper.Map<IEnumerable<SkintypeDTO>>(skintypes));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SkintypeDTO>> GetSkintype(int id)
        {
            var skintype = await _skinTypeService.GetSkintypeByIdAsync(id);
            if (skintype == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<SkintypeDTO>(skintype));
        }

        [HttpPost]
        public async Task<ActionResult<SkintypeDTO>> CreateSkintype(CreateSkintypeDTO createSkintypeDTO)
        {
            var skintype = _mapper.Map<Skintype>(createSkintypeDTO);
            await _skinTypeService.AddSkintypeAsync(skintype);
            return CreatedAtAction(nameof(GetSkintype), new { id = skintype.SkinTypeId }, 
                _mapper.Map<SkintypeDTO>(skintype));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkintype(int id, UpdateSkintypeDTO updateSkintypeDTO)
        {
            var existingSkintype = await _skinTypeService.GetSkintypeByIdAsync(id);
            if (existingSkintype == null)
            {
                return NotFound();
            }

            _mapper.Map(updateSkintypeDTO, existingSkintype);
            await _skinTypeService.UpdateSkintypeAsync(existingSkintype);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkintype(int id)
        {
            var skintype = await _skinTypeService.GetSkintypeByIdAsync(id);
            if (skintype == null)
            {
                return NotFound();
            }

            await _skinTypeService.DeleteSkintypeAsync(id);
            return NoContent();
        }
    }
} 