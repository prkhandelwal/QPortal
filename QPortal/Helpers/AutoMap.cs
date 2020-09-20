using AutoMapper;
using QPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QPortal.Helpers
{
    public class AutoMap : Profile
    {
        public AutoMap()
        {
            CreateMap<User, UserResponse>();
        }
    }
}
