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
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;
        private readonly IMapper _mapper;
        private readonly ILogger<PromotionController> _logger;

        public PromotionController(
            IPromotionService promotionService,
            IMapper mapper,
            ILogger<PromotionController> logger)
        {
            _promotionService = promotionService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetAllPromotions()
        {
            try
            {
                var promotions = await _promotionService.GetAllPromotionsAsync();
                if (!promotions.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<PromotionDTO>>(promotions));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all promotions");
                return StatusCode(500, "An error occurred while retrieving promotions");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PromotionDTO>> GetPromotion(int id)
        {
            try
            {
                var promotion = await _promotionService.GetPromotionByIdAsync(id);
                if (promotion == null)
                {
                    return NotFound($"Promotion with ID {id} not found");
                }
                return Ok(_mapper.Map<PromotionDTO>(promotion));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving promotion {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the promotion");
            }
        }

        [HttpPost]
        public async Task<ActionResult<PromotionDTO>> CreatePromotion(CreatePromotionDTO createPromotionDTO)
        {
            try
            {
                if (createPromotionDTO == null)
                {
                    return BadRequest("Promotion data is required");
                }

                if (createPromotionDTO.StartDate > createPromotionDTO.EndDate)
                {
                    return BadRequest("Start date must be before end date");
                }

                var promotion = _mapper.Map<Promotion>(createPromotionDTO);
                await _promotionService.AddPromotionAsync(promotion);

                var createdPromotionDto = _mapper.Map<PromotionDTO>(promotion);
                return CreatedAtAction(
                    nameof(GetPromotion),
                    new { id = promotion.PromotionId },
                    createdPromotionDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating promotion");
                return StatusCode(500, "An error occurred while creating the promotion");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, UpdatePromotionDTO updatePromotionDTO)
        {
            try
            {
                if (updatePromotionDTO == null)
                {
                    return BadRequest("Promotion update data is required");
                }

                if (updatePromotionDTO.StartDate > updatePromotionDTO.EndDate)
                {
                    return BadRequest("Start date must be before end date");
                }

                var existingPromotion = await _promotionService.GetPromotionByIdAsync(id);
                if (existingPromotion == null)
                {
                    return NotFound($"Promotion with ID {id} not found");
                }

                _mapper.Map(updatePromotionDTO, existingPromotion);
                await _promotionService.UpdatePromotionAsync(existingPromotion);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating promotion {Id}", id);
                return StatusCode(500, "An error occurred while updating the promotion");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            try
            {
                var promotion = await _promotionService.GetPromotionByIdAsync(id);
                if (promotion == null)
                {
                    return NotFound($"Promotion with ID {id} not found");
                }

                await _promotionService.DeletePromotionAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting promotion {Id}", id);
                return StatusCode(500, "An error occurred while deleting the promotion");
            }
        }
    }
} 