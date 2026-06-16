using Deraya.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace Deraya.Domain.Entities
{
    public class User : IdentityUser<long>
    {
        public User()
        {
        }

        public User(string email, AuthProvider provider = AuthProvider.Local, string? providerUserId = null)
        {
            Email = email;
            UserName = email;
            Provider = provider;
            ProviderUserId = providerUserId;
            Status = UserStatus.Pending;
            CreatedAt = DateTimeOffset.UtcNow;
        }

        public AuthProvider Provider { get; private set; } = AuthProvider.Local;
        public string? ProviderUserId { get; private set; }
        public UserStatus Status { get; private set; } = UserStatus.Pending;
        public DateTimeOffset? LastLoginAt { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdatedAt { get; private set; }
        public DateTimeOffset? DeletedAt { get; private set; }

        public Profile? Profile { get; private set; }
        public ICollection<MediaFile> UploadedMediaFiles { get; private set; } = new HashSet<MediaFile>();

        public ICollection<ResearchPaper> OwnedResearchPapers { get; private set; } = new HashSet<ResearchPaper>();

        public ICollection<RefreshToken> RefreshTokens { get; private set; } = new HashSet<RefreshToken>();

        public void Activate()
        {
            Status = UserStatus.Active;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void Suspend()
        {
            Status = UserStatus.Suspended;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void RecordLogin()
        {
            LastLoginAt = DateTimeOffset.UtcNow;
        }

        public void SoftDelete()
        {
            Status = UserStatus.Deleted;
            DeletedAt = DateTimeOffset.UtcNow;
        }

        public bool IsConfirmed()
        {
            return Status == UserStatus.Active && EmailConfirmed;
        }

        public void VerifyEmail()
        {
            Status = UserStatus.Active;
            EmailConfirmed = true;
        }
    }
}
