using Data.Models;
using Microsoft.Extensions.Logging;
using Repo;

namespace Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ICategoryRepository categoryRepository, ILogger<CategoryService> logger)
        {
            _categoryRepository = categoryRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            try
            {
                return await _categoryRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all categories");
                throw;
            }
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            try
            {
                return await _categoryRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category with ID {Id}", id);
                throw;
            }
        }

        public async Task AddCategoryAsync(Category category)
        {
            try
            {
                if (category == null)
                    throw new ArgumentNullException(nameof(category));

                await _categoryRepository.AddAsync(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding category: {CategoryName}", category?.CategoryName);
                throw;
            }
        }

        public async Task UpdateCategoryAsync(Category category)
        {
            try
            {
                if (category == null)
                    throw new ArgumentNullException(nameof(category));

                await _categoryRepository.UpdateAsync(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category: {CategoryId}", category?.CategoryId);
                throw;
            }
        }

        public async Task DeleteCategoryAsync(int id)
        {
            try
            {
                await _categoryRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category with ID {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Category>> SearchByCategoryNameAsync(string categoryName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoryName))
                    throw new ArgumentException("Category name cannot be empty", nameof(categoryName));

                return await _categoryRepository.SearchByCategoryNameAsync(categoryName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching categories by name: {CategoryName}", categoryName);
                throw;
            }
        }
    }
} 