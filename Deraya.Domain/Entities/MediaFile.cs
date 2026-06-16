using Deraya.Domain.Enums;
using Deraya.Domain.Primitives;
using System;
using System.Collections.Generic;

namespace Deraya.Domain.Entities
{
    public class MediaFile : AuditableEntity
    {
        private MediaFile()
        {
        }

        public MediaFile(
            string fileName,
            string originalFileName,
            string extension,
            string mimeType,
            long sizeInBytes,
            StorageProvider storageProvider,
            string storagePath,
            string publicUrl,
            long uploadedBy)
        {
            FileName = fileName;
            OriginalFileName = originalFileName;
            Extension = extension;
            MimeType = mimeType;
            SizeInBytes = sizeInBytes;
            StorageProvider = storageProvider;
            StoragePath = storagePath;
            PublicUrl = publicUrl;
            UploadedBy = uploadedBy;
        }

        public string FileName { get; private set; } = null!;
        public string OriginalFileName { get; private set; } = null!;
        public string Extension { get; private set; } = null!;
        public string MimeType { get; private set; } = null!;
        public long SizeInBytes { get; private set; }
        public StorageProvider StorageProvider { get; private set; }
        public string StoragePath { get; private set; } = null!;
        public string PublicUrl { get; private set; } = null!;

        // Foreign keys
        public long UploadedBy { get; private set; }

        public User UploadedByUser { get; private set; } = null!;
    }
}
