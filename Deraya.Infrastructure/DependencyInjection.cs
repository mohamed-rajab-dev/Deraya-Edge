using Deraya.Application.Interfaces.Infrastructure.Repositories;
using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Domain.Entities;
using Deraya.Infrastructure.Persistence;
using Deraya.Infrastructure.Repositories;
using Deraya.Infrastructure.Services;
using Deraya.Infrastructure.Services.AppServices;
using Deraya.Infrastructure.Services.External;
using Deraya.Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AppDbContext>(options =>
                            options.UseSqlServer(
                                config.GetConnectionString("DefaultConnection"),
                                    x => x.MigrationsAssembly(typeof(AppDbContext).Assembly.GetName().Name)));

            services.AddIdentity<User, IdentityRole<long>>(options =>
            {
                options.Password.RequiredLength = 1;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            services.Configure<MailSettings>(config.GetSection("MailSettings"));
            services.AddScoped<IMailServices, MailServices>();

            services.Configure<GoogleSettings>(config.GetSection("GoogleSettings"));
            services.Configure<MicrosoftSettings>(config.GetSection("MicrosoftSettings"));
            services.AddScoped<IMicrosoftService, MicrosoftService>();

            services.Configure<SupabaseSettings>(config.GetSection("SupabaseSettings"));
            services.AddScoped<IStorageService, StorageService>();
            //services.Configure<OneDriveSettings>(config.GetSection("OneDriveSettings"));

            services.Configure<Jwt>(config.GetSection("Jwt"));
            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IOTPService, OTPService>();

            //services.AddScoped<IFileStorageService, OneDriveStorageService>();

            // http client for external authentication
            services.AddHttpClient();

            //// External Authentication
            //services.Configure<GoogleOptions>(config.GetSection("GoogleAuth"));
            //services.Configure<GitHubOptions>(config.GetSection("GitHubAuth"));

            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.SaveToken = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = config.GetValue<string>("Jwt:Issuer"),
                    ValidAudience = config.GetValue<string>("Jwt:Audience"),
                    RequireExpirationTime = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetValue<string>("Jwt:Key") ?? "")),
                    ValidateIssuerSigningKey = true
                };

            });

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            services.AddHttpContextAccessor();

            // Repositories 
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IResearchPaperRepository, ResearchPaperRepository>();
            services.AddScoped<IMediaFileRepository, MediaFileRepository>();

            // Services
            //
            //services.AddScoped<IResearchService, ResearchService>();

            return services;
        }
    }
}
