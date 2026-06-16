using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public sealed record MicrosoftAuth(
        string IdToken
    );
}
