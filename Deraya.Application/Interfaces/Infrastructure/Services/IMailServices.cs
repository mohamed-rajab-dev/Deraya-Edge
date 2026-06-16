using Deraya.Application.Common.Response;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Interfaces.Infrastructure.Services
{
    public interface IMailServices
    {
        Task<Result<object>> SendEmail(string mailTo, string subject, string body, IList<IFormFile>? attachments = null);
    }
}
