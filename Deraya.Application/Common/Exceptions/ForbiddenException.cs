using Deraya.Application.Common.Response;
using System.Collections.Generic;
using System.Net;

namespace Deraya.Application.Common.Exceptions
{
    public class ForbiddenException : AppException
    {
        public override HttpStatusCode StatusCode => HttpStatusCode.Forbidden;

        public ForbiddenException(string userMessage, List<Error>? errors = null)
            : base(userMessage, errors)
        {
        }
    }
}
