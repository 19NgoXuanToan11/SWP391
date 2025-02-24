using Data.Response.AuthDTOs;
using Data.Response;
using Microsoft.AspNetCore.Mvc;
using Service;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication;

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
        [AllowAnonymous]
        [HttpPost("google-login")]
        public async Task<ActionResult<ServiceResponse<string>>> GoogleLogin([FromBody] string token)
        {
            var response = await _authService.GoogleLogin(token);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }
        [AllowAnonymous]
        [HttpGet("login-facebook")]
        public IActionResult LoginWithFacebook()
        {
            var authenticationProperties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("FacebookCallback")
            };
            return Challenge(authenticationProperties, FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet("facebook-callback")]
        public async Task<IActionResult> FacebookCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Lỗi xác thực Facebook");

            var claims = authenticateResult.Principal.Identities
                .FirstOrDefault()?.Claims.Select(c => new
                {
                    c.Type,
                    c.Value
                });

            return Ok(new
            {
                Message = "Đăng nhập thành công!",
                User = claims
            });
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