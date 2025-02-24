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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(
            ICategoryService categoryService,
            IMapper mapper,
            ILogger<CategoryController> logger)
        {
            _categoryService = categoryService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                if (!categories.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<CategoryDTO>>(categories));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all categories");
                return StatusCode(500, "An error occurred while retrieving categories");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return NotFound($"Category with ID {id} not found");
                }
                return Ok(_mapper.Map<CategoryDTO>(category));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the category");
            }
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> CreateCategory(CreateCategoryDTO createCategoryDTO)
        {
            try
            {
                if (createCategoryDTO == null)
                {
                    return BadRequest("Category data is required");
                }

                var category = _mapper.Map<Category>(createCategoryDTO);
                await _categoryService.AddCategoryAsync(category);

                var createdCategoryDto = _mapper.Map<CategoryDTO>(category);
                return CreatedAtAction(
                    nameof(GetCategory),
                    new { id = category.CategoryId },
                    createdCategoryDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, "An error occurred while creating the category");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDTO updateCategoryDTO)
        {
            try
            {
                if (updateCategoryDTO == null)
                {
                    return BadRequest("Category update data is required");
                }

                var existingCategory = await _categoryService.GetCategoryByIdAsync(id);
                if (existingCategory == null)
                {
                    return NotFound($"Category with ID {id} not found");
                }

                _mapper.Map(updateCategoryDTO, existingCategory);
                await _categoryService.UpdateCategoryAsync(existingCategory);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category {Id}", id);
                return StatusCode(500, "An error occurred while updating the category");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return NotFound($"Category with ID {id} not found");
                }

                await _categoryService.DeleteCategoryAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category {Id}", id);
                return StatusCode(500, "An error occurred while deleting the category");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> SearchCategories([FromQuery] string categoryName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoryName))
                {
                    return BadRequest("Category name is required for search");
                }

                var categories = await _categoryService.SearchByCategoryNameAsync(categoryName);
                if (!categories.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<CategoryDTO>>(categories));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching categories with name {CategoryName}", categoryName);
                return StatusCode(500, "An error occurred while searching categories");
            }
        }
    }
} 