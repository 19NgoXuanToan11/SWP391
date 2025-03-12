using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Repo;
using Service;

namespace SWP391_BE.Controllers
{
    public class HistoryController :ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }
        [HttpGet("GetAllHistory")]
        public async Task<IActionResult> GetAllHistories()
        {
            var histories = await _historyService.GetAllHistoriesAsync();
            return Ok(histories);
        }

        // API tìm kiếm theo mã vận đơn
        [HttpGet("SearchHistory")]
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
        public async Task<IActionResult> AddHistory([FromBody] History history)
        {
            await _historyService.AddHistoryAsync(history);
            return Ok("Lịch sử đơn hàng đã được thêm.");
        }

        // API cập nhật trạng thái đơn hàng
        [HttpPut("update-status")]
        public async Task<IActionResult> UpdateStatus([FromQuery] string trackingCode, [FromQuery] string status)
        {
            await _historyService.UpdateHistoryStatusAsync(trackingCode, status);
            return Ok("Cập nhật trạng thái đơn hàng thành công.");
        }
    }
}
