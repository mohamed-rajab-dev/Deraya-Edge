using Deraya.Application.DTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Validators
{
    public class VerifyRequestValidator : AbstractValidator<VerifyRequest>
    {
        public VerifyRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email address is required.");
            RuleFor(x => x.Code)
                .NotEmpty().WithMessage("Verification code is required.")
                .Length(6).WithMessage("Verification code must be 6 characters long.")
                .Matches(@"^\d{6}$").WithMessage("Verification code must contain only digits.");
        }
    }
}
