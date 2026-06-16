using Deraya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Deraya.Infrastructure.Persistence.Configurations
{
    public class ResearchPaperConfiguration : IEntityTypeConfiguration<ResearchPaper>
    {
        public void Configure(EntityTypeBuilder<ResearchPaper> builder)
        {
            builder.ToTable("ResearchPapers");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.Abstract)
                .IsRequired();

            builder.Property(x => x.Keywords)
                .HasMaxLength(1000);

            builder.Property(x => x.DownloadsCount)
                .HasDefaultValue(0);

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("SYSDATETIMEOFFSET()");

            builder.HasQueryFilter(x => x.DeletedAt == null);

            builder.HasIndex(x => x.OwnerId)
                .HasDatabaseName("IX_ResearchPapers_OwnerId");

            builder.HasIndex(x => x.PublishedAt)
                .HasDatabaseName("IX_ResearchPapers_PublishedAt");

            builder.HasOne(x => x.Owner)
                .WithMany(x => x.OwnedResearchPapers)
                .HasForeignKey(x => x.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.HasOne(x => x.ResearchFile)
                .WithOne()
                .HasForeignKey<ResearchPaper>(x => x.ResearchFileId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
