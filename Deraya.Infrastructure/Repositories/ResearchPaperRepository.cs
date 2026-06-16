
using Deraya.Application.Interfaces.Infrastructure.Repositories;
using Deraya.Domain.Entities;
using Deraya.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Deraya.Infrastructure.Repositories
{
    public class ResearchPaperRepository : IResearchPaperRepository
    {
        private readonly AppDbContext _context;

        public ResearchPaperRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResearchPaper?> GetByIdAsync(long id)
        {
            return await _context.Set<ResearchPaper>().FindAsync(id);
        }


        public async Task<List<ResearchPaper>> GetAll()
        {
            return await _context.Set<ResearchPaper>().AsNoTracking().ToListAsync();
        }

        public async Task<List<ResearchPaper>> GetByAuthorId(long authorId)
        {
            return await _context.Set<ResearchPaper>()
                .Where(rp => rp.OwnerId == authorId)
                .Include(rp => rp.ResearchFile)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task AddAsync(ResearchPaper researchPaper)
        {
            await _context.Set<ResearchPaper>().AddAsync(researchPaper);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ResearchPaper researchPaper)
        {
            _context.Set<ResearchPaper>().Update(researchPaper);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ResearchPaper researchPaper)
        {
            _context.Set<ResearchPaper>().Remove(researchPaper);
            await _context.SaveChangesAsync();
        }
    }
}
