using Deraya.Application.DTOs;
using Deraya.Application.Interfaces.Application;
using Deraya.Application.Interfaces.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Deraya.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(result);
        }

        [HttpPost("verify/email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyRequest request)
        {
            var result = await _authService.VerifyEmailAsync(request);
            return Ok(result);
        }

        [HttpPost("resend/otp")]
        public async Task<IActionResult> ResendOtp([FromBody] EmailRequest request)
        {
            var result = await _authService.ResendVerificationEmailAsync(request);
            return Ok(result);
        }

        [HttpGet("refresh/token")]
        public async Task<IActionResult> RefreshToken()
        {
            var result = await _authService.RefreshTokenAsync();
            return Ok(result);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var result = await _authService.LogoutAsync();
            return Ok(result);
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuth request)
        {
            var result = await _authService.AuthWithGoogle(request);
            return Ok(result);
        }

        [HttpPost("microsoft")]
        public async Task<IActionResult> MicrosoftLogin([FromBody] MicrosoftAuth request)
        {
            var result = await _authService.AuthWithMicrosoft(request);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("me/profile")]
        public async Task<IActionResult> GetCurrentUserProfile([FromQuery]ProfileRequest request)
        {
            var result = await _authService.GetCurrentUserProfileAsync(request);
            return Ok(result);
        }
        [Authorize]
        [HttpPost("me/profile")]
        public async Task<IActionResult> UpdateCurrentUserProfile([FromForm] ProfileRequestForm request)
        {
            var result = await _authService.UpdateCurrentUserProfileAsync(request);
            return Ok(result);
        }

        //[HttpGet("me")]
        //public async Task<IActionResult> Me()
        //{
        //    var result = await _authService.GetCurrentUserAsync();
        //    return Ok(result);
        //}

        //[HttpGet("oauth/{provider}")]
        //public async Task<IActionResult> OAuthRedirect(string provider)
        //{
        //    var result = await _authService.GetOAuthRedirectUrlAsync(provider);
        //    if (!result.IsSucceeded)
        //    {
        //        return BadRequest(result);
        //    }
        //    return Redirect(result.Data!);
        //}

        //[HttpPost("oauth/callback")]
        //public async Task<IActionResult> OAuthCallback([FromQuery] string provider, [FromBody] OAuthCallbackRequest request)
        //{
        //    var result = await _authService.HandleOAuthCallbackAsync(provider, request);
        //    return Ok(result);
        //}



    }
}
