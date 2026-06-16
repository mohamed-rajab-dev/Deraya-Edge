using Deraya.Application.Common.Exceptions;
using Deraya.Application.Common.Response;
using FluentValidation;
using System.Net;

namespace Deraya.Api.Middlewares;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors
                .GroupBy(x => x.PropertyName)
                .Select(g => new Error
                {
                    Name = g.Key,
                    Messages = g.Select(x => x.ErrorMessage).ToList()
                })
                .ToList();


            var response = Result<object>.Fail(
                errors,
                "Validation Failed");

            await WriteErrorResponse.WriteError(
                context,
                HttpStatusCode.BadRequest,
                response);
        }
        catch (AppException ex)
        {
            var response = Result<object>.Fail(
                ex.Errors,
                ex.UserMessage);

            await WriteErrorResponse.WriteError(
                context,
                ex.StatusCode,
                response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "An unexpected error occurred.");

            var response = Result<object>.Fail(new List<Error> 
            {
                new Error
                {
                    Name = "Server",
                    Messages = new List<string> { "An unexpected error occurred. Please try again later." , ex.Message },
                }
            
            } ,"Internal Server Error");

            

            await WriteErrorResponse.WriteError(
                context,
                HttpStatusCode.InternalServerError,
                response);
        }
    }
}