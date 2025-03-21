using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class VolumeMappingProfile : Profile
    {
        public VolumeMappingProfile()
        {
            CreateMap<Volume, VolumeDTO>();
            CreateMap<CreateVolumeDTO, Volume>();
            CreateMap<UpdateVolumeDTO, Volume>();
        }
    }
} 