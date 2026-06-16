using Deraya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Deraya.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users", "security");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(320);

            builder.Property(x => x.PasswordHash)
                .HasMaxLength(500);

            builder.Property(x => x.Provider)
                .HasConversion<byte>()
                .IsRequired();

            builder.Property(x => x.ProviderUserId)
                .HasMaxLength(200);

            builder.Property(x => x.Status)
                .HasConversion<byte>()
                .IsRequired();

            builder.Property(x => x.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("SYSDATETIMEOFFSET()");

            builder.HasQueryFilter(x => x.DeletedAt == null);

            builder.HasIndex(x => x.Email)
                .HasDatabaseName("IX_Users_Email");

            builder.HasIndex(x => x.Email)
                .IsUnique()
                .HasDatabaseName("UQ_Users_Email");

            builder.HasIndex(x => new { x.Provider, x.ProviderUserId })
                .IsUnique()
                .HasFilter("[ProviderUserId] IS NOT NULL")
                .HasDatabaseName("UQ_Users_Provider_ProviderUserId");

            builder.HasIndex(x => x.Status)
                .HasDatabaseName("IX_Users_Status");

            builder.HasIndex(x => x.LastLoginAt)
                .HasDatabaseName("IX_Users_LastLoginAt");
        }
    }
}
