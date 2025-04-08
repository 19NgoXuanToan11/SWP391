using AutoMapper;
using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repo;
using Service;
using SWP391_BE.DTOs;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public HistoryController(
            IHistoryService historyService,
            IOrderService orderService,
            IMapper mapper)
        {
            _historyService = historyService;
            _orderService = orderService;
            _mapper = mapper;
        }
        [HttpGet("GetAllHistory")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAllHistories()
        {
            var histories = await _historyService.GetAllHistoriesAsync();
            return Ok(histories);
        }
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetHistoryByOrderId(int orderId)
        {
            var history = await _historyService.GetOrderHistoryByOrderIdAsync(orderId);
            if (history == null)
            {
                return NotFound(new { message = "Không tìm thấy lịch sử đơn hàng!" });
            }

            return Ok(new
            {
                TrackingCode = history.TrackingCode,
                Shipper = history.Shipper,
                Status = history.Status,
                Products = history.OrderDetails.Select(od => new
                {
                    ProductName = od.Product.ProductName,
                    ProductImage = od.Product.Images.Select(img => img.ImageUrl).ToList()
                }).ToList()
            });
        }
 
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetHistoriesByUserId(int userId)
        {
            var histories = await _historyService.GetHistoriesByUserIdAsync(userId);
            if (!histories.Any())
            {
                return NotFound(new { message = "Không có lịch sử đơn hàng nào!" });
            }

            return Ok(histories.Select(history => new
            {
                TrackingCode = history.TrackingCode,
                Shipper = history.Shipper,
                Status = history.Status,
                TotalAmount = history.OrderDetails.FirstOrDefault()?.Order.TotalAmount ?? 0, // Lấy TotalAmount từ Order
                Products = history.OrderDetails.Select(od => new
                {
                    ProductName = od.Product.ProductName,
                    ProductImages = od.Product.Images
                        .Where(img => img.IsMainImage)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault() ?? od.Product.Images.FirstOrDefault()?.ImageUrl ?? "default-image.jpg",
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            }));
        }

        // API tìm kiếm theo mã vận đơn
        [HttpGet("SearchHistory")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetHistoryByTrackingCode([FromQuery] string trackingCode)
        {
            var history = await _historyService.GetHistoryByTrackingCodeAsync(trackingCode);
            if (history == null)
            {
                return NotFound("Không tìm thấy đơn hàng.");
            }
            return Ok(history);
        }
        // API thêm lịch sử đơn hàng
        [HttpPost("AddHistory")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddHistory([FromBody] History history)
        {
            await _historyService.AddAsync(history);
            return Ok("Lịch sử đơn hàng đã được thêm.");
        }

        // API cập nhật trạng thái đơn hàng
        [HttpPut("update-status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateStatus([FromQuery] string trackingCode, [FromQuery] string status)
        {
            var userRole = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            // Nếu là Staff, chỉ được cập nhật một số trạng thái nhất định
            if (userRole == "Staff")
            {
                var allowedStatuses = new List<string> { "Pending", "Delivering","Completed" };
                if (!allowedStatuses.Contains(status))
                {
                    return Forbid("Staff không thể cập nhật trạng thái này.");
                }
            }

            await _historyService.UpdateHistoryStatusAsync(trackingCode, status);
            return Ok("Cập nhật trạng thái đơn hàng thành công.");
        }

        // Get all orders with their IDs and statuses for a specific user
        [HttpGet("orders/user/{userId}")]
       
        public async Task<IActionResult> GetOrderStatusByUserId(int userId)
        {
            try
            {
                var orders = await _orderService.GetOrdersByUserIdAsync(userId);
                if (!orders.Any())
                {
                    return NotFound(new { message = "No orders found for this user" });
                }

                var result = new List<OrderHistoryStatusDTO>();

                foreach (var order in orders)
                {
                    try
                    {
                        var history = await _historyService.GetOrderHistoryByOrderIdAsync(order.OrderId);
                        var orderHistoryStatus = new OrderHistoryStatusDTO
                        {
                            OrderId = order.OrderId,
                            OrderStatus = order.Status,
                            TrackingCode = history?.TrackingCode ?? "Not Available",
                            Shipper = history?.Shipper ?? "Not Available",
                            HistoryStatus = history?.Status ?? "Not Available",
                            TotalAmount = order.TotalAmount,
                            FinalAmount = order.Promotion != null && order.Promotion.DiscountPercentage.HasValue && order.TotalAmount.HasValue
                                ? Math.Round(order.TotalAmount.Value - (order.TotalAmount.Value * order.Promotion.DiscountPercentage.Value / 100), 2)
                                : order.TotalAmount,
                            Products = new List<OrderDetailHistoryDTO>()
                        };

                        if (history?.OrderDetails != null)
                        {
                            orderHistoryStatus.Products = history.OrderDetails
                                .Where(od => od.Product != null) // Filter out null products
                                .Select(od => new OrderDetailHistoryDTO
                                {
                                    ProductName = od.Product?.ProductName ?? "Unknown Product",
                                    ProductImages = od.Product?.Images?.Select(img => img.ImageUrl).ToList() ?? new List<string>(),
                                    Quantity = od.Quantity,
                                    Price = od.Price
                                }).ToList();
                        }

                        result.Add(orderHistoryStatus);
                    }
                    catch (Exception)
                    {
                        // If there's an error getting history, still return the order with default values
                        result.Add(new OrderHistoryStatusDTO
                        {
                            OrderId = order.OrderId,
                            OrderStatus = order.Status,
                            TrackingCode = "Not Available",
                            Shipper = "Not Available",
                            HistoryStatus = "Not Available",
                            TotalAmount = order.TotalAmount,
                            FinalAmount = order.Promotion != null && order.Promotion.DiscountPercentage.HasValue && order.TotalAmount.HasValue
                                ? Math.Round(order.TotalAmount.Value - (order.TotalAmount.Value * order.Promotion.DiscountPercentage.Value / 100), 2)
                                : order.TotalAmount,
                            Products = new List<OrderDetailHistoryDTO>()
                        });
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving order information", error = ex.Message });
            }
        }
    }
}
