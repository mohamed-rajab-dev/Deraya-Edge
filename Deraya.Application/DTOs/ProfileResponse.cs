using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public class ProfileResponse
    {
        public string? DisplayName { get; private set; } = null;
        public string? Bio { get; private set; } = null;
        public string? Faculty { get; private set; } = null;
        public string? PhoneNumber { get; private set; } = null;
        public string? AvatarUrl { get; private set; } = null;
    }
}
