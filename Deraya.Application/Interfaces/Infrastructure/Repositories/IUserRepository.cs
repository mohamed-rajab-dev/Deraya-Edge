using Deraya.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace Deraya.Application.Interfaces.Infrastructure.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(long id);
        Task<User?> GetByEmailAsync(string email);
        Task<bool> CheckPasswordAsync(User user, string password);
        Task<IdentityResult> AddRoleAsync(User user, string role);
        Task<User?> GetByIdWithProfileAsync(long id);
        Task<IdentityResult> CreatePasswordAsync(User user, string password);
        Task<Payload> GetPayloadAsync(string token);
        Task UpdateProfileAsync(Profile profile);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task<Profile> GetProfile(long userId);
        Task RemoveExpiredTokens(User user);
        Task<User?> GetByRefreshTokenAsync(string token);
        Task RevokeAllRefreshToken(User user);
        Task RevokeRefreshTokenAsync(string token);
        Task AddProfileAsync(Profile profile);
        Task AddRefreshTokenAsync(RefreshToken refreshToken);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
    }
}
