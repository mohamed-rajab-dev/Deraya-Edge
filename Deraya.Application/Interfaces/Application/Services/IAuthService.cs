using Deraya.Application.Common.Response;
using Deraya.Application.DTOs;
using System.Threading.Tasks;

namespace Deraya.Application.Interfaces.Application.Services
{
    public interface IAuthService
    {
        Task<Result<AuthResponse>> LoginAsync(AuthRequest request);
        Task<Result<AuthResponse>> RegisterAsync(AuthRequest request);
        Task<Result<object>> LogoutAsync();
        Task<Result<AuthResponse>> VerifyEmailAsync(VerifyRequest request);
        Task<Result<object>> ResendVerificationEmailAsync(EmailRequest request);

        Task<Result<AuthResponse>> RefreshTokenAsync();

        Task<Result<AuthResponse>> AuthWithGoogle(GoogleAuth request);
        Task<Result<AuthResponse>> AuthWithMicrosoft(MicrosoftAuth request);
        Task<Result<ProfileResponse>> GetCurrentUserProfileAsync(ProfileRequest request);
        Task<Result<object>> UpdateCurrentUserProfileAsync(ProfileRequestForm request);

        //Task<Result<UserDto>> GetCurrentUserAsync();
        //Task<Result<AuthResponse>> DevLoginAsync(DevLoginRequest request);
        //Task<Result<string>> GetOAuthRedirectUrlAsync(string provider);
        //Task<Result<AuthResponse>> HandleOAuthCallbackAsync(string provider, OAuthCallbackRequest request);
    }
}
