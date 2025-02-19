using Data.Response.AuthDTOs;
using Data.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
   
        public interface IAuthService
        {
            Task<ServiceResponse<string>> Register(RegisterDTO model);
            Task<ServiceResponse<string>> Login(LoginDTO model);
            Task<ServiceResponse<string>> VerifyEmail(string token);
            Task<ServiceResponse<string>> ForgotPassword(string email);
            Task<ServiceResponse<string>> ResetPassword(ResetPasswordDTO model);
        }
    }

