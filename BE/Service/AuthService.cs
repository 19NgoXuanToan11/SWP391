using Data.Response.AuthDTOs;
using Data.Response;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Google.Apis.Auth;


namespace Service
{
    public class AuthService : IAuthService
    {
        private readonly SkinCareManagementDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(
            SkinCareManagementDbContext context,
            IConfiguration configuration,
            IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<ServiceResponse<string>> Register(RegisterDTO model)
        {
            var response = new ServiceResponse<string>();

            try
            {
                if (await UserExists(model.Username))
                {
                    response.Success = false;
                    response.Message = "Tên đăng nhập đã tồn tại";
                    return response;
                }

                if (await EmailExists(model.Email))
                {
                    response.Success = false;
                    response.Message = "Email đã được sử dụng";
                    return response;
                }

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
                string verificationToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

                var user = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    Password = model.Password,
                    PasswordHash = passwordHash,
                    FullName = model.FullName,
                    PhoneNumber = model.PhoneNumber,
                    Address = model.Address,
                    RoleId = 2,
                    CreatedAt = DateTime.UtcNow,
                    VerificationToken = verificationToken,
                    IsVerification = false,
                    ExpirationToken = DateTime.UtcNow.AddHours(24).ToString()
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                await _emailService.SendVerificationEmail(user.Email, verificationToken);

                response.Message = "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<string>> Login(LoginDTO model)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Username == model.Username);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "Tài khoản không tồn tại";
                    return response;
                }

                if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                {
                    response.Success = false;
                    response.Message = "Mật khẩu không chính xác";
                    return response;
                }

                if (!user.IsVerification)
                {
                    response.Success = false;
                    response.Message = "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực.";
                    return response;
                }

                if (user.IsBanned)
                {
                    response.Success = false;
                    response.Message = "Tài khoản đã bị khóa";
                    return response;
                }

                response.Data = GenerateJwtToken(user);
                response.Message = "Đăng nhập thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<string>> VerifyEmail(string token)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.VerificationToken == token);
                if (user == null)
                {
                    response.Success = false;
                    response.Message = "Token không hợp lệ";
                    return response;
                }

                if (DateTime.Parse(user.ExpirationToken!) < DateTime.UtcNow)
                {
                    response.Success = false;
                    response.Message = "Token đã hết hạn";
                    return response;
                }

                user.IsVerification = true;
                user.VerificationToken = null;
                user.ExpirationToken = null;

                await _context.SaveChangesAsync();

                await _emailService.SendWelcomeEmail(user.Email, user.Username);

                response.Message = "Xác thực email thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<string>> ForgotPassword(string email)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "Email không tồn tại trong hệ thống";
                    return response;
                }

                string resetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
                user.VerificationToken = resetToken;
                user.ExpirationToken = DateTime.UtcNow.AddHours(1).ToString();

                await _context.SaveChangesAsync();

                await _emailService.SendResetPasswordEmail(user.Email, resetToken);

                response.Message = "Đã gửi link đặt lại mật khẩu vào email của bạn";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
            }

            return response;
        }

        public async Task<ServiceResponse<string>> ResetPassword(ResetPasswordDTO model)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.VerificationToken == model.Token);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "Token không hợp lệ";
                    return response;
                }

                if (DateTime.Parse(user.ExpirationToken!) < DateTime.UtcNow)
                {
                    response.Success = false;
                    response.Message = "Token đã hết hạn";
                    return response;
                }

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);

                user.PasswordHash = passwordHash;
                user.Password = model.NewPassword;
                user.VerificationToken = null;
                user.ExpirationToken = null;

                await _context.SaveChangesAsync();

                response.Message = "Đặt lại mật khẩu thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
            }

            return response;
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        private async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.RoleName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<ServiceResponse<string>> GoogleLogin(string token)
        {
            var response = new ServiceResponse<string>();

            try
            {
                // Verify Google token
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string> { _configuration["Authentication:Google:ClientId"] }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);

                if (payload == null)
                {
                    response.Success = false;
                    response.Message = "Token Google không hợp lệ";
                    return response;
                }

                // Check if user exists
                var user = await _context.Users
                    .Include(u => u.Role)  // Include the Role
                    .FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    // Create new user if doesn't exist
                    string randomPassword = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(randomPassword);

                    user = new User
                    {
                        Username = payload.Email.Split('@')[0],
                        Email = payload.Email,
                        FullName = payload.Name,
                        Password = randomPassword,
                        PasswordHash = passwordHash,
                        RoleId = 2, // User Role
                        CreatedAt = DateTime.UtcNow,
                        IsVerification = true
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    // Reload user to get the Role
                    user = await _context.Users
                        .Include(u => u.Role)
                        .FirstOrDefaultAsync(u => u.Email == payload.Email);

                    // Send welcome email
                    await _emailService.SendWelcomeEmail(user.Email, user.Username);
                }

                if (user.IsBanned)
                {
                    response.Success = false;
                    response.Message = "Tài khoản đã bị khóa";
                    return response;
                }

                response.Data = GenerateJwtToken(user);
                response.Message = "Đăng nhập bằng Google thành công";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Lỗi đăng nhập bằng Google: " + (ex.InnerException?.Message ?? ex.Message);
            }

            return response;
        }

        // ... rest of the code ...
    }
}

