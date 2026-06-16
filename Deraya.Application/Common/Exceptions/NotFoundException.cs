using Deraya.Application.Common.Response;
using System.Collections.Generic;
using System.Net;

namespace Deraya.Application.Common.Exceptions
{
    public class NotFoundException : AppException
    {
        public override HttpStatusCode StatusCode => HttpStatusCode.NotFound;
        public NotFoundException(string userMessage, List<Error>? errors = null)
            : base(userMessage, errors)
        {
        }
    }
}
