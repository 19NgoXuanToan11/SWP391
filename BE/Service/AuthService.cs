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
using Azure;


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
                Console.WriteLine($"[VerifyEmail] Starting verification with token: {token}");

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.VerificationToken == token);

                Console.WriteLine($"[VerifyEmail] User search result: {(user != null ? user.Email : "Not found")}");

                if (user == null)
                {
                    // Kiểm tra xem user đã verify trước đó chưa
                    var verifiedUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.IsVerification);

                    if (verifiedUser != null)
                    {
                        Console.WriteLine($"[VerifyEmail] User already verified: {verifiedUser.Email}");
                        response.Success = true;
                        response.Message = "Email đã được xác thực trước đó";
                        return response;
                    }

                    Console.WriteLine("[VerifyEmail] No user found with this token");
                    response.Success = false;
                    response.Message = "Token không hợp lệ";
                    return response;
                }

                // Kiểm tra trạng thái verify
                if (user.IsVerification)
                {
                    Console.WriteLine($"[VerifyEmail] User already verified: {user.Email}");
                    response.Success = true;
                    response.Message = "Email đã được xác thực trước đó";
                    return response;
                }

                Console.WriteLine($"[VerifyEmail] Current verification status: {user.IsVerification}");
                Console.WriteLine($"[VerifyEmail] Token expiration: {user.ExpirationToken}");

                // Kiểm tra token hết hạn
                if (!string.IsNullOrEmpty(user.ExpirationToken) &&
                    DateTime.Parse(user.ExpirationToken) < DateTime.UtcNow)
                {
                    Console.WriteLine("[VerifyEmail] Token has expired");
                    response.Success = false;
                    response.Message = "Token đã hết hạn";
                    return response;
                }

                Console.WriteLine("[VerifyEmail] Token is valid, updating user status");

                try
                {
                    // Chỉ cập nhật trạng thái IsVerification, giữ nguyên token
                    user.IsVerification = true;
                    // Không set null cho VerificationToken và ExpirationToken
                    // user.VerificationToken = null;
                    // user.ExpirationToken = null;

                    Console.WriteLine("[VerifyEmail] Attempting to save changes to database");
                    await _context.SaveChangesAsync();
                    Console.WriteLine("[VerifyEmail] Changes saved successfully");

                    // Gửi email chào mừng
                    await _emailService.SendWelcomeEmail(user.Email, user.Username);
                    Console.WriteLine("[VerifyEmail] Welcome email sent");

                    response.Success = true;
                    response.Message = "Xác thực email thành công";
                    Console.WriteLine("[VerifyEmail] Verification completed successfully");
                }
                catch (Exception saveEx)
                {
                    Console.WriteLine($"[VerifyEmail] Error saving changes: {saveEx.Message}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[VerifyEmail] Error occurred: {ex.Message}");
                Console.WriteLine($"[VerifyEmail] Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[VerifyEmail] Inner exception: {ex.InnerException.Message}");
                }
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

