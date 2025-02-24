using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;
using Microsoft.Extensions.Logging;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly IMapper _mapper;
        private readonly ILogger<OrderDetailController> _logger;

        public OrderDetailController(
            IOrderDetailService orderDetailService, 
            IMapper mapper,
            ILogger<OrderDetailController> logger)
        {
            _orderDetailService = orderDetailService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailDTO>>> GetAllOrderDetails()
        {
            try
            {
                var orderDetails = await _orderDetailService.GetAllOrderDetailsAsync();
                if (!orderDetails.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<OrderDetailDTO>>(orderDetails));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all order details");
                return StatusCode(500, "An error occurred while retrieving order details");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailDTO>> GetOrderDetail(int id)
        {
            try
            {
                var orderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
                if (orderDetail == null)
                {
                    return NotFound($"Order detail with ID {id} not found");
                }
                return Ok(_mapper.Map<OrderDetailDTO>(orderDetail));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order detail {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the order detail");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderDetailDTO>> CreateOrderDetail(CreateOrderDetailDTO createOrderDetailDTO)
        {
            try
            {
                if (createOrderDetailDTO == null)
                {
                    return BadRequest("Order detail data is required");
                }

                var orderDetail = _mapper.Map<OrderDetail>(createOrderDetailDTO);
                await _orderDetailService.AddOrderDetailAsync(orderDetail);

                var createdOrderDetailDto = _mapper.Map<OrderDetailDTO>(orderDetail);
                return CreatedAtAction(
                    nameof(GetOrderDetail),
                    new { id = orderDetail.OrderDetailId },
                    createdOrderDetailDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order detail");
                return StatusCode(500, "An error occurred while creating the order detail");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(int id, UpdateOrderDetailDTO updateOrderDetailDTO)
        {
            try
            {
                if (updateOrderDetailDTO == null)
                {
                    return BadRequest("Order detail update data is required");
                }

                var existingOrderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
                if (existingOrderDetail == null)
                {
                    return NotFound($"Order detail with ID {id} not found");
                }

                _mapper.Map(updateOrderDetailDTO, existingOrderDetail);
                await _orderDetailService.UpdateOrderDetailAsync(existingOrderDetail);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order detail {Id}", id);
                return StatusCode(500, "An error occurred while updating the order detail");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            try
            {
                var orderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
                if (orderDetail == null)
                {
                    return NotFound($"Order detail with ID {id} not found");
                }

                await _orderDetailService.DeleteOrderDetailAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order detail {Id}", id);
                return StatusCode(500, "An error occurred while deleting the order detail");
            }
        }
    }
} 