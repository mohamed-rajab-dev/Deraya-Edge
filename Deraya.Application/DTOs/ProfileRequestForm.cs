using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public class ProfileRequestForm
    {
        public long UserId { get;  set; }
        public string? DisplayName { get; set; } = null;
        public string? Bio { get;  set; } = null;
        public string? Faculty { get; set; } = null;
        public string? PhoneNumber { get; set; } = null;
        public IFormFile? Avatar { get;  set; } = null;

    }
}
