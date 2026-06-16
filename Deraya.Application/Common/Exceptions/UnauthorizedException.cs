using Deraya.Application.Common.Response;
using System.Collections.Generic;
using System.Net;

namespace Deraya.Application.Common.Exceptions
{
    public class UnauthorizedException : AppException
    {
        public override HttpStatusCode StatusCode => HttpStatusCode.Unauthorized;

        public UnauthorizedException(string userMessage, List<Error>? errors = null)
            : base(userMessage, errors)
        { 
        }
    }
}
