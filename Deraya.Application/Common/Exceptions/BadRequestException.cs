

using Deraya.Application.Common.Response;
using System.Net;

namespace Deraya.Application.Common.Exceptions
{
    public class BadRequestException : AppException
    {
        public override System.Net.HttpStatusCode StatusCode => HttpStatusCode.BadRequest;

        public BadRequestException( string userMessage, List<Error>? errors = null)
            : base(userMessage, errors)
        {
        }

    }
}
