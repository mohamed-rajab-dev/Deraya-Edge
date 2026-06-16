using Deraya.Application.Common.Response;

using Deraya.Application.Interfaces.Infrastructure.Repositories;
using Deraya.Domain.Entities;
using Deraya.Infrastructure.Persistence;
using Deraya.Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace Deraya.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;
        private readonly GoogleSettings _googleSettings;

        public UserRepository(UserManager<User> userManager, AppDbContext context, IOptions<GoogleSettings> googleSettings)
        {
            _userManager = userManager;
            _context = context;
            _googleSettings = googleSettings.Value;
        }

        public async Task<User?> GetByIdAsync(long id)
        {
            return await _userManager.FindByIdAsync(id.ToString());
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _userManager.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdWithProfileAsync(long id)
        {
            return await _userManager.Users
                .Include(u => u.Profile)
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task AddAsync(User user)
        {
            await _userManager.CreateAsync(user);
        }

        //public async Task AddAsyncUserWithoutPassword(User user)
        //{
        //    await _userManager.CreateAsync(user);
        //}

        public async Task UpdateAsync(User user)
        {
            await _userManager.UpdateAsync(user);
        }

        public async Task AddProfileAsync(Profile profile)
        {
            await _context.Set<Profile>().AddAsync(profile);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProfileAsync(Profile profile)
        {
            _context.Set<Profile>().Update(profile);
            await _context.SaveChangesAsync();
        }

        public async Task AddRefreshTokenAsync(RefreshToken refreshToken)
        {
            await _context.Set<RefreshToken>().AddAsync(refreshToken);

            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            return await _context.Set<RefreshToken>().FirstOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task<bool> CheckPasswordAsync(User user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task RemoveExpiredTokens(User user)
        {
            await _context.Set<RefreshToken>()
                .Where(rt => rt.UserId == user.Id &&
                             rt.ExpiresAt < DateTime.UtcNow)
                .ExecuteDeleteAsync();
        }

        public async Task RevokeAllRefreshToken(User user)
        {
            await _context.Set<RefreshToken>()
                .Where(rt => rt.UserId == user.Id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(rt => rt.RevokedAt, DateTimeOffset.UtcNow));

        }

        public Task<IdentityResult> CreatePasswordAsync(User user, string password)
        {
            return _userManager.CreateAsync(user, password);
        }

        public Task<IdentityResult> AddRoleAsync(User user, string role)
        {
            return _userManager.AddToRoleAsync(user, role);
        }

        public Task<User?> GetByRefreshTokenAsync(string token)
        {
            return _userManager.Users
                .Include(u => u.RefreshTokens)
                .SingleOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == token));
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            await _context.Set<RefreshToken>()
                .Where(rt => rt.Token == token)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(rt => rt.RevokedAt, DateTimeOffset.UtcNow));
        }

        public async Task<Payload> GetPayloadAsync(string token)
        {
            var payload = await ValidateAsync(token, new ValidationSettings
            {
                Audience = [_googleSettings.ClientId]
            });
            return payload;
        }

        public async Task<Profile> GetProfile(long userId)
        {
            return await _context.Set<Profile>().Include(p => p.AvatarMedia).FirstOrDefaultAsync(p => p.UserId == userId);
        }
    }
}
