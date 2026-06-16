using Deraya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Deraya.Infrastructure.Persistence.Configurations
{
    public class MediaFileConfiguration : IEntityTypeConfiguration<MediaFile>
    {
        public void Configure(EntityTypeBuilder<MediaFile> builder)
        {
            builder.ToTable("MediaFiles");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ValueGeneratedOnAdd();

            builder.Property(x => x.FileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.OriginalFileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.Extension)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(x => x.MimeType)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.StorageProvider)
                .HasConversion<byte>()
                .IsRequired();

            builder.Property(x => x.StoragePath)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(x => x.PublicUrl)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("SYSDATETIMEOFFSET()");

            builder.HasQueryFilter(x => x.DeletedAt == null);

            builder.HasIndex(x => x.UploadedBy)
                .HasDatabaseName("IX_MediaFiles_UploadedBy");

            builder.HasIndex(x => x.CreatedAt)
                .HasDatabaseName("IX_MediaFiles_CreatedAt");

            builder.HasOne(x => x.UploadedByUser)
                .WithMany(x => x.UploadedMediaFiles)
                .HasForeignKey(x => x.UploadedBy)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
