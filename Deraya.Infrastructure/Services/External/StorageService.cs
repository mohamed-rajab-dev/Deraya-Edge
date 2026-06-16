using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Domain.Entities;
using Deraya.Domain.Enums;
using Deraya.Infrastructure.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;

namespace Deraya.Infrastructure.Services.External
{
    public class StorageService : IStorageService
    {
        private readonly HttpClient _httpClient;
        private readonly SupabaseSettings _supabaseSettings;
        public StorageService(HttpClient httpClient , IOptions<SupabaseSettings> options)
        {
            _httpClient = httpClient;
            _supabaseSettings = options.Value;
        }

        public async Task<MediaFile> UploadFileAsync(IFormFile file, FileType fileType, long userId)
        {

            var folder = fileType switch
            {
                FileType.Profile => "profiles",
                FileType.Document => "documents",
                _ => throw new ArgumentOutOfRangeException(nameof(fileType))
            };

            var extension = Path.GetExtension(file.FileName);

            var fileName =
                $"{Guid.NewGuid():N}{extension}";

            var storagePath =
                $"{folder}/{fileName}";


            var uploadUrl =
                $"{_supabaseSettings.ProjectUrl}/storage/v1/object/Deraya/{storagePath}";

            await using var stream = file.OpenReadStream();

            using var content = new StreamContent(stream);

            content.Headers.ContentType =
                new MediaTypeHeaderValue(file.ContentType);

            using var request =
                new HttpRequestMessage(HttpMethod.Post, uploadUrl);

            request.Headers.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    _supabaseSettings.ServiceRoleKey);

            request.Headers.Add("x-upsert", "true");

            request.Content = content;

            var response =
                await _httpClient.SendAsync(
                    request);

            response.EnsureSuccessStatusCode();

            var publicUrl =
                $"{_supabaseSettings.ProjectUrl}/storage/v1/object/public/Deraya/{storagePath}";

            return new MediaFile(
                fileName: fileName,
                originalFileName: file.FileName,
                extension: extension,
                mimeType: file.ContentType,
                sizeInBytes: file.Length,
                storageProvider: StorageProvider.Supabase,
                storagePath: storagePath,
                publicUrl: publicUrl,
                uploadedBy: userId);
        }
    }
}
