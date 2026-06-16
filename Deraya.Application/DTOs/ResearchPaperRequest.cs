using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public class ResearchPaperRequest
    {
        public long AuthorId { get; set; }
        public string Title { get; set; } = null!;
        public string Abstract { get; set; } = null!;
        public string Keywords { get; set; } = null!;
        public IFormFile ResearchFile { get; set; } = null!;
    }
}
