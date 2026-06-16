using Deraya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Deraya.Infrastructure.Persistence.Configurations
{
    public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
    {
        public void Configure(EntityTypeBuilder<Profile> builder)
        {
            builder.ToTable("Profiles");

            builder.HasKey(x => x.UserId);

            builder.Property(x => x.DisplayName)
                .HasMaxLength(100);

            builder.Property(x => x.Bio)
                .HasMaxLength(2000);

            builder.Property(x => x.PhoneNumber)
                .HasMaxLength(30);

            builder.HasOne(x => x.User)
                .WithOne(x => x.Profile)
                .HasForeignKey<Profile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.HasOne(x => x.AvatarMedia)
                .WithOne()
                .HasForeignKey<Profile>(x => x.AvatarMediaId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
