using Deraya.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Repositories
{
    public interface IMediaFileRepository
    {
        Task<MediaFile?> GetByIdAsync(long id);
        Task AddAsync(MediaFile mediaFile);
        Task DeleteAsync(MediaFile mediaFile);
    }
}
