using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace Deraya.Application.DTOs
{
    public class ProfileRequest
    {
        public long UserId { get; set; }
    }
}
