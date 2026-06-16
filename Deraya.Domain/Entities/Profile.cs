using Deraya.Domain.Enums;
using System;

namespace Deraya.Domain.Entities
{
    public class Profile
    {
        private Profile()
        {
        }


        public Profile(long userId)
        {
            UserId = userId;
        }

        public Profile(long userId, string? displayName, string? faculty, string? phoneNumber, long? avatarMediaId, string? externalAvatarUrl, AvatarProvider avatarProvider = AvatarProvider.Local): this(userId)
        {
            DisplayName = displayName;
            PhoneNumber = phoneNumber;
            Faculty = faculty;
            AvatarMediaId = avatarMediaId;
            ExternalAvatarUrl = externalAvatarUrl;
            AvatarProvider = avatarProvider;
        }

        public string? Faculty { get; private set; } = null;
        public string? DisplayName { get; private set; } = null;
        public string? Bio { get; private set; } = null;
        public string? PhoneNumber { get; private set; } = null;

        public string? ExternalAvatarUrl { get; private set; } = null;

        public AvatarProvider AvatarProvider { get; private set; } = AvatarProvider.Local;

        // Foreign keys
        public long? AvatarMediaId { get; private set; }
        public long UserId { get; private set; }

        public User User { get; private set; } = null!;
        public MediaFile? AvatarMedia { get; private set; }


        public void UpdateAvatar(long? avatarMediaId, AvatarProvider avatarProvider = AvatarProvider.Local)
        {
            AvatarMediaId = avatarMediaId;
            AvatarProvider = avatarProvider;
        }

        public void UpdateProfile(string? displayName, string? faculty, string? bio, string? phoneNumber)
        {
            if((!string.IsNullOrWhiteSpace(displayName)))
                DisplayName = displayName;

            if((!string.IsNullOrWhiteSpace(phoneNumber)))
                PhoneNumber = phoneNumber;

            if(!string.IsNullOrWhiteSpace(faculty))
                Faculty = faculty;
            if(!string.IsNullOrWhiteSpace(bio))
                Bio = bio;
            if(!string.IsNullOrWhiteSpace(phoneNumber))
                PhoneNumber = phoneNumber;
        }
    }
}
