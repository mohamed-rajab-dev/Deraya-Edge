using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Deraya.Infrastructure.Services.AppServices
{
    public class MicrosoftService : IMicrosoftService
    {
        private readonly MicrosoftSettings _microsoftSettings;

        public MicrosoftService(IOptions<MicrosoftSettings> microsoftSettings)
        {
            _microsoftSettings = microsoftSettings.Value;
        }

        public async Task<ClaimsPrincipal> ValidateAsync(string idToken)
        {
            var clientId = _microsoftSettings.ClientId;

            var configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
        "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
        new OpenIdConnectConfigurationRetriever());

            var openIdConfig =
                await configManager.GetConfigurationAsync();

            var handler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidIssuer = openIdConfig.Issuer,

                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidAudience = clientId,
                IssuerSigningKeys = openIdConfig.SigningKeys
            };

            return handler.ValidateToken(
                idToken,
                validationParameters,
                out _);
        }
    }
}
