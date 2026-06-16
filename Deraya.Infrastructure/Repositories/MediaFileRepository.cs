using Deraya.Application.Interfaces.Infrastructure.Repositories;
using Deraya.Domain.Entities;
using Deraya.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;

namespace Deraya.Infrastructure.Repositories
{
    public class MediaFileRepository : IMediaFileRepository
    {
        private readonly AppDbContext _context;

        public MediaFileRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MediaFile?> GetByIdAsync(long id)
        {
            return await _context.Set<MediaFile>().FindAsync(id);
        }

        public async Task AddAsync(MediaFile mediaFile)
        {
            await _context.Set<MediaFile>().AddAsync(mediaFile);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(MediaFile mediaFile)
        {
            _context.Set<MediaFile>().Remove(mediaFile);
            await _context.SaveChangesAsync();
        }
    }
}
