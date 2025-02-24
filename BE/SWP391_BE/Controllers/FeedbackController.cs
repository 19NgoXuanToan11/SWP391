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
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IMapper _mapper;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(
            IFeedbackService feedbackService,
            IMapper mapper,
            ILogger<FeedbackController> logger)
        {
            _feedbackService = feedbackService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackDTO>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacksAsync();
                if (!feedbacks.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<FeedbackDTO>>(feedbacks));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all feedbacks");
                return StatusCode(500, "An error occurred while retrieving feedbacks");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackDTO>> GetFeedback(int id)
        {
            try
            {
                var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
                if (feedback == null)
                {
                    return NotFound($"Feedback with ID {id} not found");
                }
                return Ok(_mapper.Map<FeedbackDTO>(feedback));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving feedback {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the feedback");
            }
        }

        [HttpPost]
        public async Task<ActionResult<FeedbackDTO>> CreateFeedback(CreateFeedbackDTO createFeedbackDTO)
        {
            try
            {
                if (createFeedbackDTO == null)
                {
                    return BadRequest("Feedback data is required");
                }

                var feedback = _mapper.Map<Feedback>(createFeedbackDTO);
                await _feedbackService.AddFeedbackAsync(feedback);

                var createdFeedbackDto = _mapper.Map<FeedbackDTO>(feedback);
                return CreatedAtAction(
                    nameof(GetFeedback),
                    new { id = feedback.FeedbackId },
                    createdFeedbackDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating feedback");
                return StatusCode(500, "An error occurred while creating the feedback");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeedback(int id, UpdateFeedbackDTO updateFeedbackDTO)
        {
            try
            {
                if (updateFeedbackDTO == null)
                {
                    return BadRequest("Feedback update data is required");
                }

                var existingFeedback = await _feedbackService.GetFeedbackByIdAsync(id);
                if (existingFeedback == null)
                {
                    return NotFound($"Feedback with ID {id} not found");
                }

                _mapper.Map(updateFeedbackDTO, existingFeedback);
                await _feedbackService.UpdateFeedbackAsync(existingFeedback);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating feedback {Id}", id);
                return StatusCode(500, "An error occurred while updating the feedback");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
                if (feedback == null)
                {
                    return NotFound($"Feedback with ID {id} not found");
                }

                await _feedbackService.DeleteFeedbackAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting feedback {Id}", id);
                return StatusCode(500, "An error occurred while deleting the feedback");
            }
        }
    }
} 