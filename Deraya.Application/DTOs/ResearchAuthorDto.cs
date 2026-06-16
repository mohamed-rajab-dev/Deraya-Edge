using System;

namespace Deraya.Application.DTOs
{
    public class ResearchAuthorDto
    {
        public Guid UserId { get; set; }
        public string DisplayName { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}
