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
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IMapper _mapper;
        private readonly ILogger<RoleController> _logger;

        public RoleController(
            IRoleService roleService,
            IMapper mapper,
            ILogger<RoleController> logger)
        {
            _roleService = roleService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetAllRoles()
        {
            try
            {
                var roles = await _roleService.GetAllRolesAsync();
                if (!roles.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<RoleDTO>>(roles));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all roles");
                return StatusCode(500, "An error occurred while retrieving roles");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> GetRole(int id)
        {
            try
            {
                var role = await _roleService.GetRoleByIdAsync(id);
                if (role == null)
                {
                    return NotFound($"Role with ID {id} not found");
                }
                return Ok(_mapper.Map<RoleDTO>(role));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving role {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the role");
            }
        }

        [HttpPost]
        public async Task<ActionResult<RoleDTO>> CreateRole(CreateRoleDTO createRoleDTO)
        {
            try
            {
                if (createRoleDTO == null)
                {
                    return BadRequest("Role data is required");
                }

                var role = _mapper.Map<Role>(createRoleDTO);
                await _roleService.AddRoleAsync(role);

                var createdRoleDto = _mapper.Map<RoleDTO>(role);
                return CreatedAtAction(
                    nameof(GetRole),
                    new { id = role.RoleId },
                    createdRoleDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating role");
                return StatusCode(500, "An error occurred while creating the role");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, UpdateRoleDTO updateRoleDTO)
        {
            try
            {
                if (updateRoleDTO == null)
                {
                    return BadRequest("Role update data is required");
                }

                var existingRole = await _roleService.GetRoleByIdAsync(id);
                if (existingRole == null)
                {
                    return NotFound($"Role with ID {id} not found");
                }

                _mapper.Map(updateRoleDTO, existingRole);
                await _roleService.UpdateRoleAsync(existingRole);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating role {Id}", id);
                return StatusCode(500, "An error occurred while updating the role");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var role = await _roleService.GetRoleByIdAsync(id);
                if (role == null)
                {
                    return NotFound($"Role with ID {id} not found");
                }

                await _roleService.DeleteRoleAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting role {Id}", id);
                return StatusCode(500, "An error occurred while deleting the role");
            }
        }
    }
} 