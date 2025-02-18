using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class SkintypeMappingProfile : Profile
    {
        public SkintypeMappingProfile()
        {
            CreateMap<Skintype, SkintypeDTO>();
            CreateMap<CreateSkintypeDTO, Skintype>();
            CreateMap<UpdateSkintypeDTO, Skintype>();
        }
    }
} 