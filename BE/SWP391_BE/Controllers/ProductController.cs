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
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                var productDtos = products.Select(p => new ProductDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    MainIngredients = p.MainIngredients,
                    BrandId = p.BrandId,
                    VolumeId = p.VolumeId,
                    SkinTypeId = p.SkinTypeId,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                    BrandName = p.Brand?.BrandName,
                    VolumeName = p.Volume?.VolumeSize,
                    SkinTypeName = p.SkinType?.SkinTypeName,
                    CategoryName = p.Category?.CategoryName
                });

                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetProducts: {Message}", ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
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

                var productDto = new ProductDTO
                {
                    ProductId = product.ProductId,
                    ProductName = product.ProductName,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock,
                    MainIngredients = product.MainIngredients,
                    BrandId = product.BrandId,
                    VolumeId = product.VolumeId,
                    SkinTypeId = product.SkinTypeId,
                    CategoryId = product.CategoryId,
                    CreatedAt = product.CreatedAt,
                    ImageUrls = product.Images.Select(i => i.ImageUrl).ToList(),
                    BrandName = product.Brand?.BrandName,
                    VolumeName = product.Volume?.VolumeSize,
                    SkinTypeName = product.SkinType?.SkinTypeName,
                    CategoryName = product.Category?.CategoryName
                };

                return Ok(productDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {Id}: {Message}", id, ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("brand/{brandId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByBrand(int brandId)
        {
            try
            {
                var products = await _productService.GetProductsByBrandAsync(brandId);
                var productDtos = products.Select(p => new ProductDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    MainIngredients = p.MainIngredients,
                    BrandId = p.BrandId,
                    VolumeId = p.VolumeId,
                    SkinTypeId = p.SkinTypeId,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                    BrandName = p.Brand?.BrandName,
                    VolumeName = p.Volume?.VolumeSize,
                    SkinTypeName = p.SkinType?.SkinTypeName,
                    CategoryName = p.Category?.CategoryName
                });

                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by brand {BrandId}: {Message}", brandId, ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory(int categoryId)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(categoryId);
                var productDtos = products.Select(p => new ProductDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    MainIngredients = p.MainIngredients,
                    BrandId = p.BrandId,
                    VolumeId = p.VolumeId,
                    SkinTypeId = p.SkinTypeId,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                    BrandName = p.Brand?.BrandName,
                    VolumeName = p.Volume?.VolumeSize,
                    SkinTypeName = p.SkinType?.SkinTypeName,
                    CategoryName = p.Category?.CategoryName
                });

                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by category {CategoryId}: {Message}", categoryId, ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("skintype/{skinTypeId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsBySkinType(int skinTypeId)
        {
            try
            {
                var products = await _productService.GetProductsBySkinTypeAsync(skinTypeId);
                var productDtos = products.Select(p => new ProductDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    MainIngredients = p.MainIngredients,
                    BrandId = p.BrandId,
                    VolumeId = p.VolumeId,
                    SkinTypeId = p.SkinTypeId,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                    BrandName = p.Brand?.BrandName,
                    VolumeName = p.Volume?.VolumeSize,
                    SkinTypeName = p.SkinType?.SkinTypeName,
                    CategoryName = p.Category?.CategoryName
                });

                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by skin type {SkinTypeId}: {Message}", skinTypeId, ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> SearchProducts([FromQuery] string searchTerm)
        {
            try
            {
                var products = await _productService.SearchProductsAsync(searchTerm);
                var productDtos = products.Select(p => new ProductDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    MainIngredients = p.MainIngredients,
                    BrandId = p.BrandId,
                    VolumeId = p.VolumeId,
                    SkinTypeId = p.SkinTypeId,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt,
                    ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                    BrandName = p.Brand?.BrandName,
                    VolumeName = p.Volume?.VolumeSize,
                    SkinTypeName = p.SkinType?.SkinTypeName,
                    CategoryName = p.Category?.CategoryName
                });

                return Ok(productDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with term {SearchTerm}: {Message}", searchTerm, ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
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

                var product = _mapper.Map<Product>(createProductDto);
                var imageUrls = createProductDto.ImageUrls ?? new List<string>(); // Đảm bảo không null
                var result = await _productService.AddProductAsync(product, imageUrls);


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
                await _productService.DeleteProductAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {Id}: {Message}", id, ex.Message);

                if (ex.Message.Contains("not found"))
                {
                    return NotFound(ex.Message);
                }

                if (ex.Message.Contains("referenced in orders") || ex.Message.Contains("has feedback"))
                {
                    return BadRequest(ex.Message);
                }

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}