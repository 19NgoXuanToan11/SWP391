using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IEmailService
    {
        Task SendVerificationEmail(string toEmail, string token);
        Task SendResetPasswordEmail(string toEmail, string token);
        Task SendWelcomeEmail(string toEmail, string username);
    }
}
