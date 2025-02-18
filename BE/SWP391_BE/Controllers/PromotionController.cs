using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;
        private readonly IMapper _mapper;

        public PromotionController(IPromotionService promotionService, IMapper mapper)
        {
            _promotionService = promotionService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetAllPromotions()
        {
            var promotions = await _promotionService.GetAllPromotionsAsync();
            return Ok(_mapper.Map<IEnumerable<PromotionDTO>>(promotions));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PromotionDTO>> GetPromotion(int id)
        {
            var promotion = await _promotionService.GetPromotionByIdAsync(id);
            if (promotion == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<PromotionDTO>(promotion));
        }

        [HttpPost]
        public async Task<ActionResult<PromotionDTO>> CreatePromotion(CreatePromotionDTO createPromotionDTO)
        {
            var promotion = _mapper.Map<Promotion>(createPromotionDTO);
            await _promotionService.AddPromotionAsync(promotion);
            return CreatedAtAction(nameof(GetPromotion), new { id = promotion.PromotionId }, 
                _mapper.Map<PromotionDTO>(promotion));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, UpdatePromotionDTO updatePromotionDTO)
        {
            var existingPromotion = await _promotionService.GetPromotionByIdAsync(id);
            if (existingPromotion == null)
            {
                return NotFound();
            }

            _mapper.Map(updatePromotionDTO, existingPromotion);
            await _promotionService.UpdatePromotionAsync(existingPromotion);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var promotion = await _promotionService.GetPromotionByIdAsync(id);
            if (promotion == null)
            {
                return NotFound();
            }

            await _promotionService.DeletePromotionAsync(id);
            return NoContent();
        }
    }
} 