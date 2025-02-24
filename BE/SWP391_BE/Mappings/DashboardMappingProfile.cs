using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class DashboardMappingProfile : Profile
    {
        public DashboardMappingProfile()
        {
            CreateMap<DashboardReport, DashboardStatisticsDTO>()
                .ForMember(dest => dest.SalesGrowth, opt => opt.MapFrom(src => src.SalesGrowthRate))
                .ForMember(dest => dest.OrdersGrowth, opt => opt.MapFrom(src => src.OrdersGrowthRate))
                .ForMember(dest => dest.UserGrowth, opt => opt.MapFrom(src => src.UserGrowthRate))
                .ForMember(dest => dest.OverallGrowth, opt => opt.MapFrom(src => src.OverallGrowthRate));

            CreateMap<DashboardStatisticsDTO, DashboardReport>()
                .ForMember(dest => dest.SalesGrowthRate, opt => opt.MapFrom(src => src.SalesGrowth))
                .ForMember(dest => dest.OrdersGrowthRate, opt => opt.MapFrom(src => src.OrdersGrowth))
                .ForMember(dest => dest.UserGrowthRate, opt => opt.MapFrom(src => src.UserGrowth))
                .ForMember(dest => dest.OverallGrowthRate, opt => opt.MapFrom(src => src.OverallGrowth));
        }
    }
} 