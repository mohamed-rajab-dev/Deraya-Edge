using Deraya.Application.Common.Response;

using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MimeKit;
using Deraya.Infrastructure.Settings;
using Deraya.Application.Interfaces.Infrastructure.Services;


namespace Deraya.Infrastructure.Services.External
{
    public class MailServices : IMailServices
    {
        private readonly MailSettings _mailSettings;
        public MailServices(IOptions<MailSettings> mailStettingOption ) 
        {
            _mailSettings = mailStettingOption.Value;
        }
        public async Task<Result<object>> SendEmail(string mailTo, string subject, string body, IList<IFormFile>? attachments = null)
        {
            try 
            {
                var email = new MimeMessage
                {
                    Sender = MailboxAddress.Parse(_mailSettings.Email),
                    Subject = subject
                };

                email.To.Add(MailboxAddress.Parse(mailTo));
                email.From.Add(new MailboxAddress(_mailSettings.DisplayName , _mailSettings.Email));

                var builder = new BodyBuilder
                {
                    HtmlBody = body
                };

                if (attachments != null)
                {
                    foreach (var attachment in attachments)
                    {
                        if(attachment.Length > 0)
                        {
                            using var ms = new MemoryStream();
                            await attachment.CopyToAsync(ms);
                            builder.Attachments.Add(attachment.FileName , ms.ToArray() , ContentType.Parse(attachment.ContentType));
                        }
                    }
                }
                
                email.Body = builder.ToMessageBody();
                var stmp = new SmtpClient();
                await stmp.ConnectAsync(_mailSettings.Host , _mailSettings.Port , SecureSocketOptions.StartTls);
                await stmp.AuthenticateAsync(_mailSettings.Email, _mailSettings.Password);
                await stmp.SendAsync(email);
                await stmp.DisconnectAsync(true);

                return Result<object>.Success("The message is sent");
            }
            catch(Exception ex) 
            {                
                return Result<object>.Fail(message:ex.Message);
            }
        }
    }
}
