using Deraya.Domain.Entities;
using Deraya.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Services
{
    public interface IStorageService
    {
        Task<MediaFile> UploadFileAsync(IFormFile file , FileType fileType , long userId);
    }
}
