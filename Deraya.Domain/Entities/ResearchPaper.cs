using Deraya.Domain.Primitives;
using System;
using System.Collections.Generic;

namespace Deraya.Domain.Entities
{
    public class ResearchPaper : AuditableEntity
    {
        private ResearchPaper()
        {
        }

        public ResearchPaper(long ownerId, string title, string @abstract, long researchFileId, string? keywords = null)
        {
            OwnerId = ownerId;
            Title = title;
            Abstract = @abstract;
            Keywords = keywords;
            PublishedAt = DateTimeOffset.UtcNow;
            ResearchFileId = researchFileId;
            
        }

        public void IncrementDownloads()
        {
            DownloadsCount++;
        }

        public void SetPublishedAt(DateTimeOffset? publishedAt)
        {
            PublishedAt = publishedAt;
        }

        public string Title { get; private set; } = null!;
        public string Abstract { get; private set; } = null!;
        public string? Keywords { get; private set; }
        public int DownloadsCount { get; private set; }
        public DateTimeOffset? PublishedAt { get; private set; }

        // Foreign keys
        public long OwnerId { get; private set; }
        public long ResearchFileId { get; private set; }

        public User Owner { get; private set; } = null!;
        public MediaFile ResearchFile { get; private set; } = null!;

    }
}
