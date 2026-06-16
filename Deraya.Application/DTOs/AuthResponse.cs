namespace Deraya.Application.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; } = null!;
        public long UserId { get; set; }
        public string Email { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string? AvatarUrl { get; set; }

    }
}
