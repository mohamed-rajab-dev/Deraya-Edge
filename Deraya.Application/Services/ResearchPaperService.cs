using Deraya.Application.Common.Response;
using Deraya.Application.DTOs;
using Deraya.Application.Interfaces.Application.Services;
using Deraya.Application.Interfaces.Infrastructure.Repositories;
using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Application.Validators;
using Deraya.Domain.Entities;
using Deraya.Domain.Enums;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Services
{
    public class ResearchPaperService : IResearchPaperService
    {
        private readonly IResearchPaperRepository _researchPaperRepository;
        private readonly IStorageService _storageService;
        private readonly IMediaFileRepository _mediaFileRepository;

        private readonly IValidator<ResearchPaperRequest> _researchPaperRequestValidator;

        public ResearchPaperService(IResearchPaperRepository researchPaperRepository,
                IValidator<ResearchPaperRequest> researchPaperRequestValidator,
                IStorageService storageService,
                IMediaFileRepository mediaFileRepository
                )
        {
            _researchPaperRepository = researchPaperRepository;
            _researchPaperRequestValidator = researchPaperRequestValidator;
            _storageService = storageService;
            _mediaFileRepository = mediaFileRepository;
        }

        public async Task<Result<object>> AddResearchPaperAsync(ResearchPaperRequest request)
        {
            await _researchPaperRequestValidator.ValidateAndThrowAsync(request);

            var media = await _storageService.UploadFileAsync(request.ResearchFile, FileType.Document, request.AuthorId);

            await _mediaFileRepository.AddAsync(media);

            var research = new ResearchPaper(request.AuthorId, request.Title, request.Abstract, media.Id, request.Keywords);
            await _researchPaperRepository.AddAsync(research);

            return Result<object>.Success("The search was successfully saved");


        }

        public async Task<Result<List<ResearchPaperDto>>> GetAllResearchPapersAsync()
        {
            var researchs = (await _researchPaperRepository.GetAll()).Select(r => new ResearchPaperDto
            {
                Title = r.Title,
                Abstract = r.Abstract,
                PublishedAt = r.PublishedAt,
                Url = r.ResearchFile.PublicUrl
            }).ToList();

            return Result<List<ResearchPaperDto>>.Success(researchs);           
            
        }

        public async Task<Result<List<ResearchPaperDto>>> GetResearchPapersByAuthorIdAsync(long authorId)
        {
            var researchs = (await _researchPaperRepository.GetByAuthorId(authorId)).Select(r => new ResearchPaperDto
            {
                Title = r.Title,
                Abstract = r.Abstract,
                PublishedAt = r.PublishedAt,
                Url = r.ResearchFile.PublicUrl
            }).ToList();

            return Result<List<ResearchPaperDto>>.Success(researchs);
        }
    }
}
