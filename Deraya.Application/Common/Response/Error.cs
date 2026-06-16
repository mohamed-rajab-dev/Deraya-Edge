using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.Common.Response
{
    public sealed class Error
    {
        public string Name { get; init; } = string.Empty;
        public List<string> Messages { get; init; } = [];
    }
}
