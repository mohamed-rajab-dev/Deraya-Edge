using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public class VerifyRequest
    {
        public string Email { get; set; } = null!;
        public string Code { get; set; } = null!;
    }
}
