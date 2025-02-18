using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Service;
using SWP391_BE.DTOs;
using Data.Models;

namespace SWP391_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly IMapper _mapper;

        public OrderDetailController(IOrderDetailService orderDetailService, IMapper mapper)
        {
            _orderDetailService = orderDetailService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailDTO>>> GetAllOrderDetails()
        {
            var orderDetails = await _orderDetailService.GetAllOrderDetailsAsync();
            return Ok(_mapper.Map<IEnumerable<OrderDetailDTO>>(orderDetails));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailDTO>> GetOrderDetail(int id)
        {
            var orderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
            if (orderDetail == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<OrderDetailDTO>(orderDetail));
        }

        [HttpPost]
        public async Task<ActionResult<OrderDetailDTO>> CreateOrderDetail(CreateOrderDetailDTO createOrderDetailDTO)
        {
            var orderDetail = _mapper.Map<OrderDetail>(createOrderDetailDTO);
            await _orderDetailService.AddOrderDetailAsync(orderDetail);
            return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.OrderDetailId }, 
                _mapper.Map<OrderDetailDTO>(orderDetail));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(int id, UpdateOrderDetailDTO updateOrderDetailDTO)
        {
            var existingOrderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
            if (existingOrderDetail == null)
            {
                return NotFound();
            }

            _mapper.Map(updateOrderDetailDTO, existingOrderDetail);
            await _orderDetailService.UpdateOrderDetailAsync(existingOrderDetail);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);
            if (orderDetail == null)
            {
                return NotFound();
            }

            await _orderDetailService.DeleteOrderDetailAsync(id);
            return NoContent();
        }
    }
} 