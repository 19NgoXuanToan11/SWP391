using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkintypeController : ControllerBase
    {
        private readonly ISkintypeService _skintypeService;
        private readonly IMapper _mapper;

        public SkintypeController(ISkintypeService skintypeService, IMapper mapper)
        {
            _skintypeService = skintypeService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkintypeDTO>>> GetAllSkintypes()
        {
            var skintypes = await _skintypeService.GetAllSkintypesAsync();
            return Ok(_mapper.Map<IEnumerable<SkintypeDTO>>(skintypes));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SkintypeDTO>> GetSkintype(int id)
        {
            var skintype = await _skintypeService.GetSkintypeByIdAsync(id);
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
            await _skintypeService.AddSkintypeAsync(skintype);
            return CreatedAtAction(nameof(GetSkintype), new { id = skintype.SkinTypeId }, 
                _mapper.Map<SkintypeDTO>(skintype));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkintype(int id, UpdateSkintypeDTO updateSkintypeDTO)
        {
            var existingSkintype = await _skintypeService.GetSkintypeByIdAsync(id);
            if (existingSkintype == null)
            {
                return NotFound();
            }

            _mapper.Map(updateSkintypeDTO, existingSkintype);
            await _skintypeService.UpdateSkintypeAsync(existingSkintype);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkintype(int id)
        {
            var skintype = await _skintypeService.GetSkintypeByIdAsync(id);
            if (skintype == null)
            {
                return NotFound();
            }

            await _skintypeService.DeleteSkintypeAsync(id);
            return NoContent();
        }
    }
} 