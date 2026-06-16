using Deraya.Application.Common.Response;
using Deraya.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Services
{
    public interface IOTPService
    {
        Task<Result<object>> SendEmailOtp(User user);
        Task<Result<object>> VerifyEmailOtp(User user, string code);
    }
}
