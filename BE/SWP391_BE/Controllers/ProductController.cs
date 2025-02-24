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
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductController> _logger;

        public ProductController(
            IProductService productService,
            IMapper mapper,
            ILogger<ProductController> logger)
        {
            _productService = productService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetAllProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound($"Product with ID {id} not found");
                }
                return Ok(_mapper.Map<ProductDTO>(product));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("brand/{brandId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByBrand(int brandId)
        {
            try
            {
                var products = await _productService.GetProductsByBrandAsync(brandId);
                return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by brand {BrandId}", brandId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory(int categoryId)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(categoryId);
                return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by category {CategoryId}", categoryId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("skintype/{skinTypeId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsBySkinType(int skinTypeId)
        {
            try
            {
                var products = await _productService.GetProductsBySkinTypeAsync(skinTypeId);
                return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by skin type {SkinTypeId}", skinTypeId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> SearchProducts([FromQuery] string searchTerm)
        {
            try
            {
                var products = await _productService.SearchProductsAsync(searchTerm);
                return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with term {SearchTerm}", searchTerm);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct(CreateProductDTO createProductDTO)
        {
            try
            {
                var product = _mapper.Map<Product>(createProductDTO);
                product.CreatedAt = DateTime.UtcNow;

                // Add images
                if (createProductDTO.ImageUrls?.Any() == true)
                {
                    product.Images = createProductDTO.ImageUrls.Select(url => new ProductImage
                    {
                        ImageUrl = url,
                        IsMainImage = product.Images.Count == 0 // First image is main image
                    }).ToList();
                }

                var createdProduct = await _productService.AddProductAsync(product);
                
                // Fetch the complete product with all navigation properties
                var completeProduct = await _productService.GetProductByIdAsync(createdProduct.ProductId);
                return CreatedAtAction(
                    nameof(GetProduct),
                    new { id = createdProduct.ProductId },
                    _mapper.Map<ProductDTO>(completeProduct)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDTO updateProductDTO)
        {
            try
            {
                var existingProduct = await _productService.GetProductByIdAsync(id);
                if (existingProduct == null)
                {
                    return NotFound($"Product with ID {id} not found");
                }

                _mapper.Map(updateProductDTO, existingProduct);

                // Update images
                if (updateProductDTO.ImageUrls?.Any() == true)
                {
                    existingProduct.Images.Clear();
                    existingProduct.Images = updateProductDTO.ImageUrls.Select(url => new ProductImage
                    {
                        ImageUrl = url,
                        ProductId = id,
                        IsMainImage = existingProduct.Images.Count == 0 // First image is main image
                    }).ToList();
                }

                await _productService.UpdateProductAsync(existingProduct);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound($"Product with ID {id} not found");
                }

                await _productService.DeleteProductAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
} 