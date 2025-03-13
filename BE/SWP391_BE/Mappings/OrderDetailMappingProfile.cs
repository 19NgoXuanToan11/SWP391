using AutoMapper;
using Data.Models;
using SWP391_BE.DTOs;

public class OrderDetailMappingProfile : Profile
{
    public OrderDetailMappingProfile()
    {
        CreateMap<OrderDetail, OrderDetailDTO>()
            .ForMember(dest => dest.OrderDetailId, opt => opt.MapFrom(src => src.OrderDetailId))
            .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.HistoryId, opt => opt.MapFrom(src => src.HistoryId)); // Thêm dòng này

        CreateMap<CreateOrderDetailDTO, OrderDetail>()
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore())
            .ForMember(dest => dest.HistoryId, opt => opt.MapFrom(src => src.HistoryId)); // Thêm dòng này

        CreateMap<UpdateOrderDetailDTO, OrderDetail>()
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore())
            .ForMember(dest => dest.HistoryId, opt => opt.MapFrom(src => src.HistoryId)); // Thêm dòng này
    }
}
