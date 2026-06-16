using Deraya.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Repositories
{
    public interface IResearchPaperRepository
    {
        Task<ResearchPaper?> GetByIdAsync(long id);
        Task<List<ResearchPaper>> GetAll();
        Task<List<ResearchPaper>> GetByAuthorId(long authorId);

        Task AddAsync(ResearchPaper researchPaper);
        Task UpdateAsync(ResearchPaper researchPaper);
        Task DeleteAsync(ResearchPaper researchPaper);
    }
}
