using Data.Models;
using System;

namespace SWP391_BE.DTOs
{
    public class OrderDTO
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public int? PromotionId { get; set; }
        public decimal? PromotionDiscount { get; set; }

        public List<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }

    public class CartItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

    }
    public class CreateOrderDTO
    {
        public int UserId { get; set; }
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        public int? PromotionId { get; set; }
        public decimal? PromotionDiscount { get; set; }
    }

    public class UpdateOrderDTO
    {
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
    }
    
    public class OrderStatusDTO
    {
        public string Status { get; set; }
        public bool PaymentConfirmed { get; set; }

    }

    public class OrderStatusInfoDTO
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
    }

    public class OrderHistoryStatusDTO
    {
        public int OrderId { get; set; }
        public string OrderStatus { get; set; }
        public string TrackingCode { get; set; }
        public string Shipper { get; set; }
        public string HistoryStatus { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? FinalAmount { get; set; }
        public List<OrderDetailHistoryDTO> Products { get; set; }
    }

    public class OrderDetailHistoryDTO
    {
        public string ProductName { get; set; }
        public List<string> ProductImages { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
} 