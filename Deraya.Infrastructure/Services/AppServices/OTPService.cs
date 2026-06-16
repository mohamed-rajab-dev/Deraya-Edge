using Deraya.Application.Common.Response;
using Deraya.Application.Interfaces.Infrastructure.Services;
using Deraya.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using OtpNet;


namespace Deraya.Infrastructure.Services.AppServices
{
    public class OTPService : IOTPService
    {
        private readonly UserManager<User> _userManager;
        private readonly IMailServices _mailServices;
        public OTPService(UserManager<User> userManager , IMailServices mailServices) 
        {
            _userManager = userManager;
            _mailServices = mailServices;
        }
        public async Task<Result<object>> SendEmailOtp(User? user)
        {
            
            const string publicMessage =
                "If registration is successful, a verification code will be sent to your email.";

            if (user is null)
                return Result<object>.Success(new object(), publicMessage);

            if (await _userManager.IsEmailConfirmedAsync(user))
                return Result<object>.Success(new object(), publicMessage);

            await _userManager.RemoveAuthenticationTokenAsync(
                user,
                "EmailOtp",
                "SecretKey");

            await _userManager.RemoveAuthenticationTokenAsync(
                user,
                "EmailOtp",
                "Attempts");

            var secretKey = KeyGeneration.GenerateRandomKey(20);

            await _userManager.SetAuthenticationTokenAsync(
                user,
                "EmailOtp",
                "SecretKey",
                Convert.ToBase64String(secretKey));

            await _userManager.SetAuthenticationTokenAsync(
                user,
                "EmailOtp",
                "Attempts",
                "0");

            var totp = new Totp(secretKey, step: 300); // 5 Minutes
            var otpCode = totp.ComputeTotp();

            var html = BuildOtpEmailTemplate(otpCode);

            var sendEmail = await _mailServices.SendEmail(
                user.Email!,
                "Deraya Verification Code",
                html);


            if (!sendEmail.IsSucceeded)
            {
                return Result<object>.Success(new object(), publicMessage);
            }

            return Result<object>.Success(new object(), publicMessage);
        }

        public async Task<Result<object>> VerifyEmailOtp(User user , string code)
        {
            const string failureMessage = "The verification request could not be completed.";
            const string successMessage = "Email verified successfully.";


            var result = await _userManager.IsEmailConfirmedAsync(user);

            if (await _userManager.IsEmailConfirmedAsync(user))
                return Result<object>.Fail(failureMessage);

            var secretKeyValue = await _userManager.GetAuthenticationTokenAsync(user, "EmailOtp", "SecretKey");
            var attemptsValue = await _userManager.GetAuthenticationTokenAsync(user, "EmailOtp", "Attempts");

            if (string.IsNullOrWhiteSpace(secretKeyValue))
                return Result<object>.Fail(failureMessage);


            int attempts = int.Parse(attemptsValue ?? "0");

            if (attempts >= 5)
                return Result<object>.Fail(failureMessage);

            var totp = new Totp(Convert.FromBase64String(secretKeyValue), step: 300);
            bool isValid = totp.VerifyTotp(code, out long timeStepMatched, new VerificationWindow(previous: 1, future: 1));


            if (!isValid)
            {
                attempts++;
                await _userManager.SetAuthenticationTokenAsync(user, "EmailOtp", "Attempts", attempts.ToString());
                return Result<object>.Fail(failureMessage);
            }

			user.VerifyEmail();
            await _userManager.UpdateAsync(user);

            await _userManager.RemoveAuthenticationTokenAsync(user, "EmailOtp", "SecretKey");
            await _userManager.RemoveAuthenticationTokenAsync(user, "EmailOtp", "Attempts");

            return Result<object>.Success(new object(), successMessage);
        }

        private string BuildOtpEmailTemplate(string otpCode)
        {
            return $@"
                    <!DOCTYPE html>
                    <html lang=""en"">
                    <head>
                        <meta charset=""UTF-8"">
                        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                        <title>Deraya Verification Code</title>
                    </head>
                    <body style=""margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;"">
                    
                        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#f4f6f9;padding:40px 0;"">
                            <tr>
                                <td align=""center"">
                    
                                    <table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);"">
                    
                                        <tr>
                                            <td align=""center"" style=""background:#fed727;padding:30px;"">
                                                <h1 style=""margin:0;color:#1f2937;font-size:28px;"">
                                                    Deraya
                                                </h1>
                                                <p style=""margin:10px 0 0;color:#374151;font-size:14px;"">
                                                    Email Verification
                                                </p>
                                            </td>
                                        </tr>
                    
                                        <tr>
                                            <td style=""padding:40px 35px;color:#374151;"">
                    
                                                <h2 style=""margin-top:0;color:#111827;"">
                                                    Verify Your Email Address
                                                </h2>
                    
                                                <p style=""font-size:15px;line-height:1.8;"">
                                                    Thank you for registering with <strong>Deraya</strong>.
                                                    To complete your account verification, please use the
                                                    one-time verification code below:
                                                </p>
                    
                                                <div style=""text-align:center;margin:35px 0;"">
                                                    <div style=""
                                                        display:inline-block;
                                                        background:#f9fafb;
                                                        border:2px dashed #fed727;
                                                        padding:18px 35px;
                                                        border-radius:10px;"">
                    
                                                        <span style=""
                                                            font-size:36px;
                                                            font-weight:bold;
                                                            letter-spacing:8px;
                                                            color:#111827;"">
                                                            {otpCode}
                                                        </span>
                                                    </div>
                                                </div>
                    
                                                <p style=""font-size:15px;line-height:1.8;"">
                                                    This verification code will expire in
                                                    <strong>5 minutes</strong>.
                                                </p>
                    
                                                <p style=""font-size:15px;line-height:1.8;"">
                                                    If you did not request this verification code,
                                                    please ignore this email. No further action is required.
                                                </p>
                    
                                                <hr style=""border:none;border-top:1px solid #e5e7eb;margin:30px 0;"" />
                    
                                                <p style=""font-size:13px;color:#6b7280;line-height:1.7;margin:0;"">
                                                    For security reasons, never share this code with anyone.
                                                    Deraya employees will never ask you for your verification code.
                                                </p>
                    
                                            </td>
                                        </tr>
                    
                                        <tr>
                                            <td align=""center"" style=""background:#f9fafb;padding:20px;color:#6b7280;font-size:12px;"">
                                                © {DateTime.UtcNow.Year} Deraya. All rights reserved.
                                            </td>
                                        </tr>
                    
                                    </table>
                    
                                </td>
                            </tr>
                        </table>
                    
                    </body>
                    </html>";
        }

    }
}
