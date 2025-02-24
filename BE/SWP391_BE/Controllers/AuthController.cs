using Data.Response.AuthDTOs;
using Data.Response;
using Microsoft.AspNetCore.Mvc;
using Service;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;

namespace SWP391_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<ServiceResponse<string>>> Register(RegisterDTO model)
        {
            var response = await _authService.Register(model);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<ServiceResponse<string>>> Login(LoginDTO model)
        {
            var response = await _authService.Login(model);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpGet("verify-email")]
        public async Task<ActionResult<ServiceResponse<string>>> VerifyEmail([FromQuery] string token)
        {
            var response = await _authService.VerifyEmail(token);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ServiceResponse<string>>> ForgotPassword([FromBody] string email)
        {
            var response = await _authService.ForgotPassword(email);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ServiceResponse<string>>> ResetPassword(ResetPasswordDTO model)
        {
            var response = await _authService.ResetPassword(model);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }
    }
}