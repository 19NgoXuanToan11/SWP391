using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class SkinRoutineMappingProfile : Profile
    {
        public SkinRoutineMappingProfile()
        {
            CreateMap<SkinRoutine, SkinRoutineDTO>()
                .ForMember(dest => dest.SkinTypeName, opt => opt.MapFrom(src => src.SkinType.SkinTypeName));
            CreateMap<CreateSkinRoutineDTO, SkinRoutine>();
            CreateMap<UpdateSkinRoutineDTO, SkinRoutine>();
        }
    }
} 