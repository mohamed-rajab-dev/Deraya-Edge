using System;
using System.Collections.Generic;

namespace Deraya.Application.DTOs
{
    public class ResearchResponse
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public string OwnerName { get; set; } = null!;
        public Guid FacultyId { get; set; }
        public string FacultyName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Abstract { get; set; } = null!;
        public string? Keywords { get; set; }
        public Guid ResearchFileId { get; set; }
        public string ResearchFileUrl { get; set; } = null!;
        public Guid? CoverMediaId { get; set; }
        public string? CoverMediaUrl { get; set; }
        public int DownloadsCount { get; set; }
        public DateTimeOffset? PublishedAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public List<ResearchAuthorDto> Authors { get; set; } = [];
    }
}
