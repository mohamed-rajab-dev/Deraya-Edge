
using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Domain.Entities;
using Deraya.Infrastructure.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Deraya.Infrastructure.Services.AppServices
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<User> userManager;
        private readonly Jwt jwt;
        private readonly IHttpContextAccessor httpContextAccessor;
        public TokenService(UserManager<User> userManager, IOptions<Jwt> jwt, IHttpContextAccessor httpContextAccessor)
        {
            this.userManager = userManager;
            this.jwt = jwt.Value;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> CreateJwtToken(User user)
        {
            var userClaims = await userManager.GetClaimsAsync(user);
            var roles = await userManager.GetRolesAsync(user);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!)
            };

            claims.AddRange(userClaims);
            claims.AddRange(roles.Select(role => new Claim("role", role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(jwt.DurationInMinute),
                SigningCredentials = creds,
                Issuer = jwt.Issuer,
                Audience = jwt.Audience
            };

            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }

        public RefreshToken GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            return new RefreshToken(Convert.ToBase64String(randomNumber), DateTime.UtcNow.AddDays(10));
        }

        public void SetRefreshTokenCookie(string refreshToken, DateTimeOffset expires)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = expires.ToLocalTime(),
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.Strict

            };
            httpContextAccessor.HttpContext!.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        public void DeleteRefreshTokenCookie()
        {
            httpContextAccessor.HttpContext!.Response.Cookies.Delete("refreshToken");
        }

        public string? GetRefreshTokenFromCookie()
        {
            return httpContextAccessor.HttpContext!.Request.Cookies["refreshToken"];
        }
    }
}

