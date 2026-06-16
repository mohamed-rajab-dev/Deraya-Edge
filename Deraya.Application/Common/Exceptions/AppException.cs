using Azure.Core;
using Deraya.Application.Common.Response;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Deraya.Application.Common.Exceptions
{
    public abstract class AppException : Exception
    {
        public abstract HttpStatusCode StatusCode { get; }
        public List<Error>? Errors { get; } = null;
        public string UserMessage { get; }

        protected AppException(string userMessage, List<Error>? errors = null) : base(userMessage)
        {
            Errors = errors;
            UserMessage = userMessage;
        }

    }
}
