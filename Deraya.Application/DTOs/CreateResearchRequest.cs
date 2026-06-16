using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Deraya.Application.DTOs
{
    public class CreateResearchRequest
    {
        public string Title { get; set; } = null!;
        public string Abstract { get; set; } = null!;
        public string? Keywords { get; set; }
        public Guid FacultyId { get; set; }
        public IFormFile ResearchFile { get; set; } = null!;
        public IFormFile? CoverImage { get; set; }
        public List<Guid>? AuthorIds { get; set; }
    }
}
