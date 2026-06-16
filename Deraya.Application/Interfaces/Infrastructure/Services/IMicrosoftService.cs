using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Services
{
    public interface IMicrosoftService
    {
        Task<ClaimsPrincipal> ValidateAsync(string idToken);
    }
}
