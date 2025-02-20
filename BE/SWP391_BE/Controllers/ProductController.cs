using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductController> _logger;
        private readonly IBrandService _brandService;
        private readonly IVolumeService _volumeService;
        private readonly ISkinTypeService _skinTypeService;
        private readonly ICategoryService _categoryService;

        public ProductController(
            IProductService productService,
            IMapper mapper,
            ILogger<ProductController> logger,
            IBrandService brandService,
            IVolumeService volumeService,
            ISkinTypeService skinTypeService,
            ICategoryService categoryService)
        {
            _productService = productService;
            _mapper = mapper;
            _logger = logger;
            _brandService = brandService;
            _volumeService = volumeService;
            _skinTypeService = skinTypeService;
            _categoryService = categoryService;
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
        public async Task<ActionResult<ProductDTO>> CreateProduct([FromBody] CreateProductDTO createProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate các foreign key
                if (!await _brandService.ExistsAsync(createProductDto.BrandId.Value))
                {
                    return BadRequest($"Brand với ID {createProductDto.BrandId} không tồn tại");
                }
                    
                if (!await _volumeService.ExistsAsync(createProductDto.VolumeId.Value))
                {
                    return BadRequest($"Volume với ID {createProductDto.VolumeId} không tồn tại");
                }
                    
                if (!await _skinTypeService.ExistsAsync(createProductDto.SkinTypeId.Value))
                {
                    return BadRequest($"SkinType với ID {createProductDto.SkinTypeId} không tồn tại");
                }
                    
                if (!await _categoryService.ExistsAsync(createProductDto.CategoryId.Value))
                {
                    return BadRequest($"Category với ID {createProductDto.CategoryId} không tồn tại");
                }

                // Validate ImageUrls
                if (createProductDto.ImageUrls == null || !createProductDto.ImageUrls.Any())
                {
                    return BadRequest("Sản phẩm phải có ít nhất 1 hình ảnh");
                }

                var product = _mapper.Map<Product>(createProductDto);
                
                // Tạo danh sách ProductImage từ ImageUrls
                product.Images = createProductDto.ImageUrls.Select(url => new ProductImage 
                { 
                    ImageUrl = url 
                }).ToList();

                var result = await _productService.AddProductAsync(product);
                
                return CreatedAtAction(
                    nameof(GetProduct), 
                    new { id = result.ProductId }, 
                    _mapper.Map<ProductDTO>(result)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product: {Message}", ex.Message);
                return StatusCode(500, ex.Message);
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
                await _productService.UpdateProductAsync(existingProduct);

                if (updateProductDTO.ImageUrls?.Any() == true)
                {
                    await _productService.UpdateProductImagesAsync(id, updateProductDTO.ImageUrls);
                }

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