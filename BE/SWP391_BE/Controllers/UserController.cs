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
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(
            IUserService userService,
            IMapper mapper,
            ILogger<UserController> logger)
        {
            _userService = userService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                if (!users.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<UserDTO>>(users));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all users");
                return StatusCode(500, "An error occurred while retrieving users");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found");
                }
                return Ok(_mapper.Map<UserDTO>(user));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the user");
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> CreateUser(CreateUserDTO createUserDTO)
        {
            try
            {
                if (createUserDTO == null)
                {
                    return BadRequest("User data is required");
                }

                var user = _mapper.Map<User>(createUserDTO);
                user.CreatedAt = DateTime.UtcNow;
                await _userService.AddUserAsync(user);

                var createdUserDto = _mapper.Map<UserDTO>(user);
                return CreatedAtAction(
                    nameof(GetUser),
                    new { id = user.UserId },
                    createdUserDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, "An error occurred while creating the user");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDTO updateUserDTO)
        {
            try
            {
                if (updateUserDTO == null)
                {
                    return BadRequest("User update data is required");
                }

                var existingUser = await _userService.GetUserByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound($"User with ID {id} not found");
                }

                _mapper.Map(updateUserDTO, existingUser);
                await _userService.UpdateUserAsync(existingUser);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {Id}", id);
                return StatusCode(500, "An error occurred while updating the user");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found");
                }

                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {Id}", id);
                return StatusCode(500, "An error occurred while deleting the user");
            }
        }
    }
} 