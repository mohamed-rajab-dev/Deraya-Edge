using Deraya.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Services
{
    public interface IFileStorageService
    {
        Task<(string StoragePath, string PublicUrl, StorageProvider Provider)>
            UploadFileAsync(IFormFile file, string folder);

        Task<(byte[] Bytes, string ContentType, string FileName)>
            DownloadFileAsync(string storagePath);
    }
}

