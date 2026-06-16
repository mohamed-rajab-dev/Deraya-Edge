using Deraya.Application.DTOs;
using FluentValidation;

namespace Deraya.Application.Validators
{
    public class CreateResearchRequestValidator : AbstractValidator<CreateResearchRequest>
    {
        public CreateResearchRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

            RuleFor(x => x.Abstract)
                .NotEmpty().WithMessage("Abstract is required.");

            RuleFor(x => x.FacultyId)
                .NotEmpty().WithMessage("FacultyId is required.");

            RuleFor(x => x.ResearchFile)
                .NotNull().WithMessage("ResearchFile is required.")
                .Must(file => file.Length > 0).WithMessage("ResearchFile cannot be empty.");
        }
    }
}
