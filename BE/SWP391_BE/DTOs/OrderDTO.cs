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
    }

    public class UpdateOrderDTO
    {
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
    }
} 