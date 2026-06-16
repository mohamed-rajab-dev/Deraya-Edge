using Deraya.Application.DTOs;
using Deraya.Domain.Entities;
using Deraya.Domain.Enums;
using Mapster;
using System;
using System.Linq;

namespace Deraya.Application.Common.Mappings
{
    public class MappingRegister : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {

            config.NewConfig<Profile, ProfileResponse>()
                .Map(dest => dest.DisplayName, src => src.DisplayName)
                .Map(dest => dest.PhoneNumber, src => src.PhoneNumber)
                .Map(dest => dest.Bio, src => src.Bio)
                .Map(dest => dest.Faculty, src => src.Faculty)
                .Map(dest => dest.AvatarUrl, src =>
                    src.AvatarProvider == AvatarProvider.Local
                        ? src.AvatarMedia!.PublicUrl
                        : src.ExternalAvatarUrl
                );
            //    config.NewConfig<User, UserDto>()
            //        .Map(dest => dest.Id, src => src.Id)
            //        .Map(dest => dest.Email, src => src.Email ?? string.Empty)
            //        .Map(dest => dest.DisplayName, src => src.Profile != null ? src.Profile.DisplayName : string.Empty)
            //        .Map(dest => dest.PhoneNumber, src => src.Profile != null ? src.Profile.PhoneNumber : string.Empty);

            //    config.NewConfig<ResearchPaper, ResearchResponse>()
            //        .Map(dest => dest.Id, src => src.Id)
            //        .Map(dest => dest.OwnerId, src => src.OwnerId)
            //        .Map(dest => dest.OwnerName, src => src.Owner != null && src.Owner.Profile != null ? src.Owner.Profile.DisplayName : (src.Owner != null ? src.Owner.UserName : string.Empty))
            //        .Map(dest => dest.FacultyId, src => src.FacultyId)
            //        .Map(dest => dest.FacultyName, src => src.Faculty != null ? src.Faculty.Name : string.Empty)
            //        .Map(dest => dest.Title, src => src.Title)
            //        .Map(dest => dest.Abstract, src => src.Abstract)
            //        .Map(dest => dest.Keywords, src => src.Keywords)
            //        .Map(dest => dest.ResearchFileId, src => src.ResearchFileId)
            //        .Map(dest => dest.ResearchFileUrl, src => src.ResearchFile != null ? src.ResearchFile.PublicUrl : string.Empty)
            //        .Map(dest => dest.CoverMediaId, src => src.CoverMediaId)
            //        .Map(dest => dest.CoverMediaUrl, src => src.CoverMedia != null ? src.CoverMedia.PublicUrl : null)
            //        .Map(dest => dest.DownloadsCount, src => src.DownloadsCount)
            //        .Map(dest => dest.PublishedAt, src => src.PublishedAt)
            //        .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            //        .Map(dest => dest.Authors, src => src.Authors != null 
            //            ? src.Authors.Select(a => new ResearchAuthorDto
            //            {
            //                UserId = a.UserId,
            //                DisplayName = a.User != null && a.User.Profile != null ? a.User.Profile.DisplayName : (a.User != null ? a.User.UserName ?? string.Empty : string.Empty),
            //                Email = a.User != null ? a.User.Email ?? string.Empty : string.Empty
            //            }).ToList() 
            //            : new System.Collections.Generic.List<ResearchAuthorDto>());
        }
    }
}
