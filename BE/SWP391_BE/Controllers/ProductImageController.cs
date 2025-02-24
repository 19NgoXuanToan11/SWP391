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
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductImageController> _logger;

        public ProductImageController(
            IProductImageService productImageService,
            IMapper mapper,
            ILogger<ProductImageController> logger)
        {
            _productImageService = productImageService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductImageDTO>>> GetAllProductImages()
        {
            try
            {
                var productImages = await _productImageService.GetAllProductImagesAsync();
                if (!productImages.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<ProductImageDTO>>(productImages));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all product images");
                return StatusCode(500, "An error occurred while retrieving product images");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductImageDTO>> GetProductImage(int id)
        {
            try
            {
                var productImage = await _productImageService.GetProductImageByIdAsync(id);
                if (productImage == null)
                {
                    return NotFound($"Product image with ID {id} not found");
                }
                return Ok(_mapper.Map<ProductImageDTO>(productImage));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product image {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the product image");
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductImageDTO>>> GetProductImagesByProductId(int productId)
        {
            try
            {
                var productImages = await _productImageService.GetImagesByProductIdAsync(productId);
                if (!productImages.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<ProductImageDTO>>(productImages));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product images for product {ProductId}", productId);
                return StatusCode(500, "An error occurred while retrieving product images");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductImageDTO>> CreateProductImage(CreateProductImageDTO createProductImageDTO)
        {
            try
            {
                if (createProductImageDTO == null)
                {
                    return BadRequest("Product image data is required");
                }

                var productImage = _mapper.Map<ProductImage>(createProductImageDTO);
                await _productImageService.AddProductImageAsync(productImage);

                var createdProductImageDto = _mapper.Map<ProductImageDTO>(productImage);
                return CreatedAtAction(
                    nameof(GetProductImage),
                    new { id = productImage.ImageId },
                    createdProductImageDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product image");
                return StatusCode(500, "An error occurred while creating the product image");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductImage(int id, UpdateProductImageDTO updateProductImageDTO)
        {
            try
            {
                if (updateProductImageDTO == null)
                {
                    return BadRequest("Product image update data is required");
                }

                var existingProductImage = await _productImageService.GetProductImageByIdAsync(id);
                if (existingProductImage == null)
                {
                    return NotFound($"Product image with ID {id} not found");
                }

                _mapper.Map(updateProductImageDTO, existingProductImage);
                await _productImageService.UpdateProductImageAsync(existingProductImage);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product image {Id}", id);
                return StatusCode(500, "An error occurred while updating the product image");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductImage(int id)
        {
            try
            {
                var productImage = await _productImageService.GetProductImageByIdAsync(id);
                if (productImage == null)
                {
                    return NotFound($"Product image with ID {id} not found");
                }

                await _productImageService.DeleteProductImageAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product image {Id}", id);
                return StatusCode(500, "An error occurred while deleting the product image");
            }
        }
    }
} 