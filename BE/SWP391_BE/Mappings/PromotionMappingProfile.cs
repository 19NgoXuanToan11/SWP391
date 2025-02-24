using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class PromotionMappingProfile : Profile
    {
        public PromotionMappingProfile()
        {
            CreateMap<Promotion, PromotionDTO>()
                .ForMember(dest => dest.PromotionId, opt => opt.MapFrom(src => src.PromotionId))
                .ForMember(dest => dest.PromotionName, opt => opt.MapFrom(src => src.PromotionName))
                .ForMember(dest => dest.DiscountPercentage, opt => opt.MapFrom(src => src.DiscountPercentage))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate));

            CreateMap<CreatePromotionDTO, Promotion>();

            CreateMap<UpdatePromotionDTO, Promotion>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
} 