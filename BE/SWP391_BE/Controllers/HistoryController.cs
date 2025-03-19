using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repo;
using Service;

namespace SWP391_BE.Controllers
{
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
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
        [Authorize(Roles = "Admin,Staff")]
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
                Products = history.OrderDetails.Select(od => new
                {
                    ProductName = od.Product.ProductName,
                    ProductImages = od.Product.Images
                        .Where(img => img.IsMainImage)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault() ?? od.Product.Images.FirstOrDefault()?.ImageUrl ?? "default-image.jpg", // Hình ảnh sản phẩm
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
    }
}
