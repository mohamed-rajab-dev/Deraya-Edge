

namespace Deraya.Application.Common.Response
{
    public class Result<T>
    {
        public bool IsSucceeded { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<Error>? Errors { get; set; } = null;

        public static Result<T> Success(string message = "")
        {
            return new Result<T> { IsSucceeded = true, Message = message };
        }
        public static Result<T> Fail(string message = "")
        {
            return new Result<T> { IsSucceeded = false, Message = message };
        }

        public static Result<T> Fail(List<Error>? errors, string message = "")
        {
            return new Result<T> { IsSucceeded = false, Errors = errors, Message = message };
        }
        public static Result<T> Success(T data, string message = "")
        {
            return new Result<T> { IsSucceeded = true, Data = data, Message = message };
        }
    }

}
