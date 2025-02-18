using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using MimeKit;
using MailKit;
using MailKit.Security;

namespace Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _fromEmail;
        private readonly string _fromName;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _websiteUrl;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _fromEmail = _configuration["EmailSettings:FromAddress"];    // Sửa From thành FromAddress
            _fromName = _configuration["EmailSettings:FromName"];
            _smtpServer = _configuration["EmailSettings:SmtpServer"];
            _smtpPort = int.Parse(_configuration["EmailSettings:Port"]);
            _smtpUsername = _configuration["EmailSettings:Username"];
            _smtpPassword = _configuration["EmailSettings:Password"];
            _websiteUrl = _configuration["AppSettings:WebsiteUrl"];
        }

        public async Task SendVerificationEmail(string toEmail, string token)
        {
            var subject = "Xác thực tài khoản của bạn";
            var verificationLink = $"{_websiteUrl}/verify-email?token={token}";

            var htmlBody = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #33++3;'>Xác thực tài khoản</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng xác thực email của bạn.</p>
                <div style='margin: 25px 0;'>
                    <a href='{verificationLink}' 
                       style='background-color: #4CAF50; color: white; padding: 12px 25px; 
                              text-decoration: none; border-radius: 3px; display: inline-block;'>
                        Xác thực ngay
                    </a>
                </div>
                <p>Hoặc copy đường link sau vào trình duyệt:</p>
                <p style='color: #666;'>{verificationLink}</p>
                <p style='color: #999; font-size: 0.9em;'>Link xác thực này sẽ hết hạn sau 24 giờ.</p>
                <hr style='border: 1px solid #eee; margin: 20px 0;'>
                <p style='color: #999; font-size: 0.8em;'>
                    Nếu bạn không yêu cầu xác thực tài khoản này, vui lòng bỏ qua email này.
                </p>
            </div>";

            await SendEmailAsync(toEmail, subject, htmlBody);
        }

        public async Task SendResetPasswordEmail(string toEmail, string token)
        {
            var subject = "Đặt lại mật khẩu";
            var resetLink = $"{_websiteUrl}/reset-password?token={token}";

            var htmlBody = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #333;'>Đặt lại mật khẩu</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Click vào nút bên dưới để tạo mật khẩu mới:</p>
                <div style='margin: 25px 0;'>
                    <a href='{resetLink}' 
                       style='background-color: #2196F3; color: white; padding: 12px 25px; 
                              text-decoration: none; border-radius: 3px; display: inline-block;'>
                        Đặt lại mật khẩu
                    </a>
                </div>
                <p>Hoặc copy đường link sau vào trình duyệt:</p>
                <p style='color: #666;'>{resetLink}</p>
                <p style='color: #999; font-size: 0.9em;'>Link này sẽ hết hạn sau 1 giờ.</p>
                <hr style='border: 1px solid #eee; margin: 20px 0;'>
                <p style='color: #999; font-size: 0.8em;'>
                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                </p>
            </div>";

            await SendEmailAsync(toEmail, subject, htmlBody);
        }

        public async Task SendWelcomeEmail(string toEmail, string username)
        {
            var subject = "Chào mừng bạn đến với hệ thống";

            var htmlBody = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #333;'>Chào mừng {username}!</h2>
                <p>Cảm ơn bạn đã xác thực tài khoản thành công.</p>
                <p>Bây giờ bạn có thể:</p>
                <ul>
                    <li>Đăng nhập vào hệ thống</li>
                    <li>Cập nhật thông tin cá nhân</li>
                    <li>Khám phá các tính năng của hệ thống</li>
                </ul>
                <div style='margin: 25px 0;'>
                    <a href='{_websiteUrl}/login' 
                       style='background-color: #4CAF50; color: white; padding: 12px 25px; 
                              text-decoration: none; border-radius: 3px; display: inline-block;'>
                        Đăng nhập ngay
                    </a>
                </div>
                <hr style='border: 1px solid #eee; margin: 20px 0;'>
                <p style='color: #999; font-size: 0.8em;'>
                    Email này được gửi tự động, vui lòng không trả lời.
                </p>
            </div>";

            await SendEmailAsync(toEmail, subject, htmlBody);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_fromName, _fromEmail));  // Sửa "Your App Name" thành _fromName
                email.To.Add(new MailboxAddress("", toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };

                email.Body = builder.ToMessageBody();

                using (var smtp = new MailKit.Net.Smtp.SmtpClient())
                {
                    await smtp.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(_smtpUsername, _smtpPassword);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                // Log lỗi và throw exception
                throw new Exception($"Lỗi khi gửi email: {ex.Message}");
            }
        }
    }
}