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
    }

    public class CreateOrderDTO
    {
        public int UserId { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
    }

    public class UpdateOrderDTO
    {
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
    }
} 