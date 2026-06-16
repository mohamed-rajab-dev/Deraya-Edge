using Deraya.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Services
{
    public interface ITokenService
    {
        Task<string> CreateJwtToken(User user);
        RefreshToken GenerateRefreshToken();
        void SetRefreshTokenCookie(string refreshToken, DateTimeOffset expires);
        string? GetRefreshTokenFromCookie();
        void DeleteRefreshTokenCookie();


    }
}
