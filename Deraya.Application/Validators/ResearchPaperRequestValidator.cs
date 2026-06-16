using Deraya.Application.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Validators
{
    public class ResearchPaperRequestValidator : AbstractValidator<ResearchPaperRequest>
    {
        private readonly string[] _allowedExtensions =
        {
            ".pdf"
        };

        private const long MaxFileSize = 20 * 1024 * 1024; // 20 MB

        public ResearchPaperRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Title is required.")
                .MaximumLength(300)
                .WithMessage("Title cannot exceed 300 characters.");

            RuleFor(x => x.Abstract)
                .NotEmpty()
                .WithMessage("Abstract is required.")
                .MaximumLength(5000)
                .WithMessage("Abstract cannot exceed 5000 characters.");

            RuleFor(x => x.Keywords)
                .NotEmpty()
                .WithMessage("Keywords are required.")
                .MaximumLength(500)
                .WithMessage("Keywords cannot exceed 500 characters.");

            RuleFor(x => x.ResearchFile)
                .NotNull()
                .WithMessage("Research file is required.");

            RuleFor(x => x.ResearchFile)
                .Must(BeValidFile)
                .When(x => x.ResearchFile != null)
                .WithMessage("Only PDF files are allowed.");

            RuleFor(x => x.ResearchFile)
                .Must(BeValidSize)
                .When(x => x.ResearchFile != null)
                .WithMessage("File size cannot exceed 20 MB.");
        }

        private bool BeValidFile(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName);

            return _allowedExtensions.Contains(
                extension,
                StringComparer.OrdinalIgnoreCase);
        }

        private bool BeValidSize(IFormFile file)
        {
            return file.Length > 0 &&
                   file.Length <= MaxFileSize;
        }
    }
}
