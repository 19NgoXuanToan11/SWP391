using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class PromotionMappingProfile : Profile
    {
        public PromotionMappingProfile()
        {
            CreateMap<Promotion, PromotionDTO>();
            CreateMap<CreatePromotionDTO, Promotion>();
            CreateMap<UpdatePromotionDTO, Promotion>();
        }
    }
} 