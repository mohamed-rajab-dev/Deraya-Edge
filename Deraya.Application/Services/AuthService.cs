using Deraya.Application.Common.Exceptions;
using Deraya.Application.Common.Response;
using Deraya.Application.DTOs;
using Deraya.Application.Interfaces.Application.Services;
using Deraya.Application.Interfaces.Infrastructure.Repositories;
using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Domain.Entities;
using Deraya.Domain.Enums;
using FluentValidation;
using Google.Apis.Auth;
using MapsterMapper;
using Microsoft.Extensions.Options;

namespace Deraya.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IValidator<AuthRequest> _authRequestValidator;
        private readonly IValidator<VerifyRequest> _verifyRequestValidator;
        private readonly IValidator<EmailRequest> _emailRequestValidator;
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        private readonly IOTPService _oTPService;
        private readonly IMicrosoftService _microsoftService;
        private readonly IMapper _mapper;
        private readonly IStorageService _storageService;
        private readonly IMediaFileRepository _mediaFileRepository;
        public AuthService(
            IValidator<AuthRequest> authRequestValidator,
            IValidator<VerifyRequest> verifyRequestValidator,
            IValidator<EmailRequest> emailRequestValidator,
            IUserRepository userRepository,
            ITokenService tokenService,
            IOTPService oTPService,
            IMicrosoftService microsoftService,
            IMapper mapper,
            IStorageService storageService,
            IMediaFileRepository mediaFileRepository
            )
        {
            _authRequestValidator = authRequestValidator;
            _verifyRequestValidator = verifyRequestValidator;
            _emailRequestValidator = emailRequestValidator;
            _userRepo = userRepository;
            _tokenService = tokenService;
            _oTPService = oTPService;
            _microsoftService = microsoftService;
            _mapper = mapper;
            _storageService = storageService;
            _mediaFileRepository = mediaFileRepository;
        }

        public async Task<Result<AuthResponse>> LoginAsync(AuthRequest request)
        {
            await _authRequestValidator.ValidateAndThrowAsync(request);

            var user = await _userRepo.GetByEmailAsync(request.Email);

            if (user == null || !await _userRepo.CheckPasswordAsync(user, request.Password) || !user.IsConfirmed())
            {
                throw new BadRequestException("Invalid email or password.", new List<Error>
                {
                    new Error
                    {
                        Name = "Email or password",
                        Messages = new List<string> { "Invalid email or password." }
                    }
                });
            }

            await _userRepo.RevokeAllRefreshToken(user);
            await _userRepo.RemoveExpiredTokens(user);


            var token = await _tokenService.CreateJwtToken(user);
            var refreashToken = _tokenService.GenerateRefreshToken();
            refreashToken.AssignToUser(user.Id);

            await _userRepo.AddRefreshTokenAsync(refreashToken);

            _tokenService.SetRefreshTokenCookie(refreashToken.Token, refreashToken.ExpiresAt);

            return Result<AuthResponse>.Success(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email!,
            });
        }

        public async Task<Result<AuthResponse>> RegisterAsync(AuthRequest request)
        {
            await _authRequestValidator.ValidateAndThrowAsync(request);

            var user = await _userRepo.GetByEmailAsync(request.Email);

            if (user != null)
            {
                throw new BadRequestException("Email is already taken.",new List<Error>
                {
                    new Error
                    {
                        Name = "Email",
                        Messages = new List<string> { "Email is already taken." }
                    }
                });
            }

           
            user = new User(request.Email);

            var userCreate = await _userRepo.CreatePasswordAsync(user, request.Password);

            if (!userCreate.Succeeded)
            {
                var errors = userCreate.Errors
                    .Select(e => new Error
                    {
                        Name = e.Code,
                        Messages = new List<string> { e.Description }
                    })
                    .ToList();

                throw new BadRequestException("User creation failed." , errors);
            }

            var otp = await _oTPService.SendEmailOtp(user);

            if (!otp.IsSucceeded)
            {
                throw new BadRequestException(otp.Message , otp.Errors);
            }

            return Result<AuthResponse>.Success(otp.Message);

        }


        public async Task<Result<AuthResponse>> VerifyEmailAsync(VerifyRequest request)
        {
            await _verifyRequestValidator.ValidateAndThrowAsync(request);

            var user = await _userRepo.GetByEmailAsync(request.Email);

             if(user == null || user.IsConfirmed())
                return Result<AuthResponse>.Fail("The verification request could not be completed.");

            var result = await _oTPService.VerifyEmailOtp(user, request.Code);

            if (!result.IsSucceeded)
            {
                throw new BadRequestException(result.Message, result.Errors);
            }

            var token = await _tokenService.CreateJwtToken(user);
            
            var refreashToken = _tokenService.GenerateRefreshToken();
            refreashToken.AssignToUser(user.Id);
            await _userRepo.AddRefreshTokenAsync(refreashToken);

            var roleCreate = await _userRepo.AddRoleAsync(user, Role.User.ToString());

            var profile = new Profile(user.Id);
            await _userRepo.AddProfileAsync(profile);

            if (!roleCreate.Succeeded)
            {
                var errors = roleCreate.Errors
                    .Select(e => new Error
                    {
                        Name = e.Code,
                        Messages = new List<string> { e.Description }
                    })
                    .ToList();
                throw new BadRequestException("Assigning role failed.", errors);
            }


            _tokenService.SetRefreshTokenCookie(refreashToken.Token, refreashToken.ExpiresAt);

            return Result<AuthResponse>.Success(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email!,

            });
        }

        public async Task<Result<object>> ResendVerificationEmailAsync(EmailRequest request)
        {
            await _emailRequestValidator.ValidateAndThrowAsync(request);

            var user = await _userRepo.GetByEmailAsync(request.Email);

            if (user == null)
                return Result<object>.Fail( "The verification request could not be completed.");

            var otp = await _oTPService.SendEmailOtp(user);

            return otp;
        }

        public async Task<Result<AuthResponse>> RefreshTokenAsync()
        {
            var token = _tokenService.GetRefreshTokenFromCookie();

            if (token == null)
                throw new BadRequestException("Invalid refresh token.");

            var user = await _userRepo.GetByRefreshTokenAsync(token);

            if (user == null)
                throw new BadRequestException("Invalid refresh token.");

            var newToken = await _tokenService.CreateJwtToken(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            newRefreshToken.AssignToUser(user.Id);

            await _userRepo.AddRefreshTokenAsync(newRefreshToken);

            _tokenService.SetRefreshTokenCookie(newRefreshToken.Token, newRefreshToken.ExpiresAt);

            return Result<AuthResponse>.Success(new AuthResponse
            {
                Token = newToken,
                UserId = user.Id,
                Email = user.Email!,
            });
        }

        public async Task<Result<object>> LogoutAsync()
        {
            var refreshToken = _tokenService.GetRefreshTokenFromCookie();

            if (string.IsNullOrWhiteSpace(refreshToken))
                return Result<object>.Fail("Refresh token not found.");

            await _userRepo.RevokeRefreshTokenAsync(refreshToken);

            _tokenService.DeleteRefreshTokenCookie();

            return Result<object>.Success("Logged out successfully.");
        }

        public async Task<Result<AuthResponse>> AuthWithGoogle(GoogleAuth request)
        {
            //var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
            var payload = await _userRepo.GetPayloadAsync(request.IdToken);

            var user = await _userRepo.GetByEmailAsync(payload.Email);


            if(user is null)
            {
                user = new User(payload.Email, AuthProvider.Google, payload.Subject);
                user.VerifyEmail();

                await _userRepo.AddAsync(user); 

                var profile = new Profile(
                    user.Id,
                    payload.Name,
                    null,
                    null,
                    null,
                    payload.Picture,
                    AvatarProvider.Google
                );
                await _userRepo.AddProfileAsync(profile);
            }

            await _userRepo.RevokeAllRefreshToken(user);
            await _userRepo.RemoveExpiredTokens(user);


            var token = await _tokenService.CreateJwtToken(user);
            var refreashToken = _tokenService.GenerateRefreshToken();
            refreashToken.AssignToUser(user.Id);

            await _userRepo.AddRefreshTokenAsync(refreashToken);

            _tokenService.SetRefreshTokenCookie(refreashToken.Token, refreashToken.ExpiresAt);

            return Result<AuthResponse>.Success(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email!,
                AvatarUrl = payload.Picture,
                DisplayName = payload.Name

            });
        }

        public async Task<Result<AuthResponse>> AuthWithMicrosoft(MicrosoftAuth request)
        {
            var principal = await _microsoftService.ValidateAsync(request.IdToken);

            var emailClaim = principal.FindFirst(c => c.Type == "email")?.Value;

            var name = principal.FindFirst(c => c.Type == "name")?.Value;
            
            var microsoftId = principal.FindFirst("oid")?.Value ?? principal.FindFirst("sub")?.Value;

            if (emailClaim == null || name == null)
            {
                throw new BadRequestException("Email claim not found in Microsoft token.");
            }

            var user = await _userRepo.GetByEmailAsync(emailClaim);

            if (user is null)
            {
                user = new User(emailClaim, AuthProvider.Microsoft, principal.FindFirst(c => c.Type == "sub")?.Value);
                user.VerifyEmail();
                await _userRepo.AddAsync(user);
                var profile = new Profile(
                    user.Id,
                    name,
                    null,
                    null,
                    null,
                    null,
                    AvatarProvider.Microsoft
                );
                await _userRepo.AddProfileAsync(profile);
            }

            await _userRepo.RevokeAllRefreshToken(user);
            await _userRepo.RemoveExpiredTokens(user);


            var token = await _tokenService.CreateJwtToken(user);
            var refreashToken = _tokenService.GenerateRefreshToken();
            refreashToken.AssignToUser(user.Id);

            await _userRepo.AddRefreshTokenAsync(refreashToken);

            _tokenService.SetRefreshTokenCookie(refreashToken.Token, refreashToken.ExpiresAt);

            return Result<AuthResponse>.Success(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email!,
                DisplayName = name
            });
        }

        public async Task<Result<ProfileResponse>> GetCurrentUserProfileAsync(ProfileRequest request)
        {
            var profile = await  _userRepo.GetProfile(request.UserId);

            var profileResponse = _mapper.Map<ProfileResponse>(profile);

            return Result<ProfileResponse>.Success(profileResponse);

        }

        public async Task<Result<object>> UpdateCurrentUserProfileAsync(ProfileRequestForm request)
        {
            var profile =  await _userRepo.GetProfile(request.UserId);


            if (request.Avatar != null) {
                var media = await _storageService.UploadFileAsync(request.Avatar,FileType.Profile , request.UserId);
                await _mediaFileRepository.AddAsync(media);
                profile.UpdateAvatar(media.Id);
            }

            profile.UpdateProfile(
                request.DisplayName,
                request.Faculty,
                request.Bio,
                request.PhoneNumber
            );

            await _userRepo.UpdateProfileAsync(profile);

            return Result<object>.Success(new { Message = "Profile updated successfully." });
        }
    }
}
