using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class SkinTypeMappingProfile : Profile
    {
        public SkinTypeMappingProfile()
        {
            CreateMap<Skintype, SkinTypeDTO>();
            CreateMap<CreateSkinTypeDTO, Skintype>();
            CreateMap<UpdateSkinTypeDTO, Skintype>();
        }
    }
} 