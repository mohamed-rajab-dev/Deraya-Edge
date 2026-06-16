using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Deraya.Application.Common.Response
{
    public class WriteErrorResponse
    {
        public static async Task WriteError(
            HttpContext context,
            HttpStatusCode statusCode,
            Result<object> response)
        {
            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(response);
        }

    }
}
