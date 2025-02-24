using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;
using Microsoft.Extensions.Logging;

namespace SWP391_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardReportService _dashboardService;
        private readonly IMapper _mapper;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IDashboardReportService dashboardService, 
            IMapper mapper,
            ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _mapper = mapper;
            _logger = logger;
        }

        // CRUD Operations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DashboardStatisticsDTO>>> GetAllReports()
        {
            try
            {
                var reports = await _dashboardService.GetAllDashboardReportsAsync();
                if (!reports.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<DashboardStatisticsDTO>>(reports));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all dashboard reports");
                return StatusCode(500, "An error occurred while retrieving dashboard reports");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DashboardStatisticsDTO>> GetReportById(int id)
        {
            try
            {
                var report = await _dashboardService.GetDashboardReportByIdAsync(id);
                if (report == null)
                {
                    return NotFound($"Dashboard report with ID {id} not found");
                }
                return Ok(_mapper.Map<DashboardStatisticsDTO>(report));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard report {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the dashboard report");
            }
        }

        [HttpPost]
        public async Task<ActionResult<DashboardStatisticsDTO>> CreateReport([FromBody] DashboardStatisticsDTO reportDto)
        {
            try
            {
                if (reportDto == null)
                {
                    return BadRequest("Report data is required");
                }

                var report = _mapper.Map<DashboardReport>(reportDto);
                report.LastUpdated = DateTime.UtcNow;
                await _dashboardService.AddDashboardReportAsync(report);

                var createdReportDto = _mapper.Map<DashboardStatisticsDTO>(report);
                return CreatedAtAction(nameof(GetReportById), new { id = report.ReportId }, createdReportDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating dashboard report");
                return StatusCode(500, "An error occurred while creating the dashboard report");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReport(int id, [FromBody] DashboardStatisticsDTO reportDto)
        {
            try
            {
                var existingReport = await _dashboardService.GetDashboardReportByIdAsync(id);
                if (existingReport == null)
                {
                    return NotFound($"Dashboard report with ID {id} not found");
                }

                var report = _mapper.Map<DashboardReport>(reportDto);
                report.ReportId = id;
                report.LastUpdated = DateTime.UtcNow;
                await _dashboardService.UpdateDashboardReportAsync(report);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating dashboard report {Id}", id);
                return StatusCode(500, "An error occurred while updating the dashboard report");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReport(int id)
        {
            try
            {
                var report = await _dashboardService.GetDashboardReportByIdAsync(id);
                if (report == null)
                {
                    return NotFound($"Dashboard report with ID {id} not found");
                }

                await _dashboardService.DeleteDashboardReportAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting dashboard report {Id}", id);
                return StatusCode(500, "An error occurred while deleting the dashboard report");
            }
        }

        // Dashboard Statistics Endpoints
        [HttpGet("statistics")]
        public async Task<ActionResult<DashboardStatisticsDTO>> GetDashboardStatistics([FromQuery] string timeRange = "Last 30 days")
        {
            try
            {
                var statistics = await _dashboardService.GetDashboardStatisticsAsync(timeRange);
                if (statistics == null)
                {
                    return NotFound("No dashboard statistics found for the specified time range");
                }
                return Ok(_mapper.Map<DashboardStatisticsDTO>(statistics));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard statistics for time range {TimeRange}", timeRange);
                return StatusCode(500, "An error occurred while retrieving dashboard statistics");
            }
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<DashboardStatisticsDTO>>> GetDashboardHistory(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest("Start date must be before end date");
                }

                var history = await _dashboardService.GetDashboardHistoryAsync(startDate, endDate);
                if (!history.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<DashboardStatisticsDTO>>(history));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard history for period {StartDate} to {EndDate}", startDate, endDate);
                return StatusCode(500, "An error occurred while retrieving dashboard history");
            }
        }

        [HttpGet("sales")]
        public async Task<ActionResult<decimal>> GetTotalSales(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest("Start date must be before end date");
                }

                var totalSales = await _dashboardService.GetTotalSalesAsync(startDate, endDate);
                return Ok(totalSales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving total sales for period {StartDate} to {EndDate}", startDate, endDate);
                return StatusCode(500, "An error occurred while retrieving total sales");
            }
        }

        [HttpGet("orders")]
        public async Task<ActionResult<int>> GetTotalOrders(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest("Start date must be before end date");
                }

                var totalOrders = await _dashboardService.GetTotalOrdersAsync(startDate, endDate);
                return Ok(totalOrders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving total orders for period {StartDate} to {EndDate}", startDate, endDate);
                return StatusCode(500, "An error occurred while retrieving total orders");
            }
        }

        [HttpGet("active-users")]
        public async Task<ActionResult<int>> GetActiveUsers()
        {
            try
            {
                var activeUsers = await _dashboardService.GetActiveUsersCountAsync();
                return Ok(activeUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active users count");
                return StatusCode(500, "An error occurred while retrieving active users count");
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult> RefreshDashboardStatistics([FromQuery] string timeRange = "Last 30 days")
        {
            try
            {
                await _dashboardService.UpdateDashboardStatisticsAsync(timeRange);
                return Ok(new { message = "Dashboard statistics refreshed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing dashboard statistics for time range {TimeRange}", timeRange);
                return StatusCode(500, "An error occurred while refreshing dashboard statistics");
            }
        }
    }
} 