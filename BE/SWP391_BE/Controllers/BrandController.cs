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
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;
        private readonly IMapper _mapper;
        private readonly ILogger<BrandController> _logger;

        public BrandController(
            IBrandService brandService,
            IMapper mapper,
            ILogger<BrandController> logger)
        {
            _brandService = brandService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandDTO>>> GetAllBrands()
        {
            try
            {
                _logger.LogInformation("Starting to retrieve all brands");
                
                var brands = await _brandService.GetAllBrandsAsync();
                if (!brands.Any())
                {
                    _logger.LogInformation("No brands found");
                    return NoContent();
                }
                
                var brandDtos = _mapper.Map<IEnumerable<BrandDTO>>(brands);
                _logger.LogInformation("Successfully retrieved {Count} brands", brandDtos.Count());
                
                return Ok(brandDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all brands: {Message}", ex.Message);
                return StatusCode(500, $"An error occurred while retrieving brands: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDTO>> GetBrand(int id)
        {
            try
            {
                var brand = await _brandService.GetBrandByIdAsync(id);
                if (brand == null)
                {
                    return NotFound($"Brand with ID {id} not found");
                }
                return Ok(_mapper.Map<BrandDTO>(brand));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving brand {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the brand");
            }
        }

        [HttpPost]
        public async Task<ActionResult<BrandDTO>> CreateBrand(CreateBrandDTO createBrandDTO)
        {
            try
            {
                if (createBrandDTO == null)
                {
                    return BadRequest("Brand data is required");
                }

                var brand = _mapper.Map<Brand>(createBrandDTO);
                await _brandService.AddBrandAsync(brand);

                var createdBrandDto = _mapper.Map<BrandDTO>(brand);
                return CreatedAtAction(
                    nameof(GetBrand),
                    new { id = brand.BrandId },
                    createdBrandDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating brand");
                return StatusCode(500, "An error occurred while creating the brand");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(int id, UpdateBrandDTO updateBrandDTO)
        {
            try
            {
                if (updateBrandDTO == null)
                {
                    return BadRequest("Brand update data is required");
                }

                var existingBrand = await _brandService.GetBrandByIdAsync(id);
                if (existingBrand == null)
                {
                    return NotFound($"Brand with ID {id} not found");
                }

                _mapper.Map(updateBrandDTO, existingBrand);
                await _brandService.UpdateBrandAsync(existingBrand);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating brand {Id}", id);
                return StatusCode(500, "An error occurred while updating the brand");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            try
            {
                var brand = await _brandService.GetBrandByIdAsync(id);
                if (brand == null)
                {
                    return NotFound($"Brand with ID {id} not found");
                }

                await _brandService.DeleteBrandAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting brand {Id}", id);
                return StatusCode(500, "An error occurred while deleting the brand");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<BrandDTO>>> SearchBrands([FromQuery] string brandName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(brandName))
                {
                    return BadRequest("Brand name is required for search");
                }

                var brands = await _brandService.SearchByBrandNameAsync(brandName);
                if (!brands.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<BrandDTO>>(brands));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching brands with name {BrandName}", brandName);
                return StatusCode(500, "An error occurred while searching brands");
            }
        }
    }
} 