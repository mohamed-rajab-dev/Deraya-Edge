using Deraya.Application.Common.Response;
using Deraya.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Application.Services
{
    public interface IResearchPaperService
    {
        Task<Result<List<ResearchPaperDto>>> GetAllResearchPapersAsync();
        Task<Result<List<ResearchPaperDto>>> GetResearchPapersByAuthorIdAsync(long authorId);
        Task<Result<object>> AddResearchPaperAsync(ResearchPaperRequest request);
    }
}
