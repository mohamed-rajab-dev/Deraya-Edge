using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public class ResearchPaperDto
    {
        public string Title { get; set; } = null!;
        public string Abstract { get; set; } = null!;
        public DateTimeOffset? PublishedAt { get; set; }
        public string Url { get; set; } = null!;
    }
}
