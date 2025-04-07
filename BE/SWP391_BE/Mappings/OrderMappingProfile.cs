using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

namespace SWP391_BE.Mappings
{
    public class OrderMappingProfile : Profile
    {
        public OrderMappingProfile()
        {
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.OrderDate))
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod))
                .ForMember(dest => dest.PromotionId, opt => opt.MapFrom(src => src.PromotionId))
                .ForMember(dest => dest.PromotionDiscount, opt => opt.MapFrom(src => 
                    src.Promotion != null && src.Promotion.DiscountPercentage.HasValue 
                    ? (src.TotalAmount * src.Promotion.DiscountPercentage.Value / 100) 
                    : 0));

            CreateMap<CreateOrderDTO, Order>()
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
                .ForMember(dest => dest.PromotionId, opt => opt.MapFrom(src => src.PromotionId))
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore())
                .ForMember(dest => dest.Payments, opt => opt.Ignore());

            CreateMap<UpdateOrderDTO, Order>()
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore())
                .ForMember(dest => dest.Payments, opt => opt.Ignore());

            CreateMap<OrderStatusDTO, Order>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
                
            CreateMap<Order, OrderStatusInfoDTO>()
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
        }
    }
} 