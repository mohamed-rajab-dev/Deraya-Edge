using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Infrastructure.Settings
{
    public class MailSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
    }
}
