using Deraya.Application.DTOs;
using Deraya.Application.Interfaces.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Deraya.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResearchController : ControllerBase
    {
        
        private readonly IResearchPaperService _researchPaperService;
        public ResearchController(IResearchPaperService researchPaperService)
        {
            _researchPaperService = researchPaperService;
        }
        public async Task<IActionResult> GetAllResearchPapers()
        {
            var result = await _researchPaperService.GetAllResearchPapersAsync();
            return Ok(result);
        }
        [Authorize]
        [HttpGet("author/{authorId}")]
        public async Task<IActionResult> GetResearchPapersByAuthorId(long authorId)
        {
            var result = await _researchPaperService.GetResearchPapersByAuthorIdAsync(authorId);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddResearchPaper([FromForm] ResearchPaperRequest request)
        {
            var result = await _researchPaperService.AddResearchPaperAsync(request);
            return Ok(result);
        }

    }
}
