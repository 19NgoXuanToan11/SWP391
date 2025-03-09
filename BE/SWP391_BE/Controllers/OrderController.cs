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
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly ILogger<OrderController> _logger;

        public OrderController(
            IOrderService orderService, 
            IMapper mapper,
            ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetAllOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                if (!orders.Any())
                {
                    return NoContent();
                }
                return Ok(_mapper.Map<IEnumerable<OrderDTO>>(orders));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all orders");
                return StatusCode(500, "An error occurred while retrieving orders");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound($"Order with ID {id} not found");
                }
                return Ok(_mapper.Map<OrderDTO>(order));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the order");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(CreateOrderDTO createOrderDTO)
        {
            try
            {
                if (createOrderDTO == null)
                {
                    return BadRequest("Order data is required");
                }
                List<OrderDetail> orderDetails = new List<OrderDetail>();
                decimal totalAmount = 0;

                createOrderDTO.Items.ForEach(item => {
                    var orderDetail = new OrderDetail
                    {
                        ProductId = item.ProductId,
                        Price = item.Price,
                        Quantity = item.Quantity,
                    };
                    totalAmount = totalAmount + ((decimal)item.Quantity * item.Price);
                    orderDetails.Add(orderDetail);
                });

                var order = new Order
                {
                    UserId = createOrderDTO.UserId,
                    OrderDate = DateTime.Now,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    OrderDetails = orderDetails
                };
                await _orderService.AddOrderAsync(order);

                var createdOrderDto = _mapper.Map<OrderDTO>(order);
                return CreatedAtAction(
                    nameof(GetOrder),
                    new { id = order.OrderId },
                    createdOrderDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, "An error occurred while creating the order");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, UpdateOrderDTO updateOrderDTO)
        {
            try
            {
                if (updateOrderDTO == null)
                {
                    return BadRequest("Order update data is required");
                }

                var existingOrder = await _orderService.GetOrderByIdAsync(id);
                if (existingOrder == null)
                {
                    return NotFound($"Order with ID {id} not found");
                }

                _mapper.Map(updateOrderDTO, existingOrder);
                await _orderService.UpdateOrderAsync(existingOrder);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order {Id}", id);
                return StatusCode(500, "An error occurred while updating the order");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound($"Order with ID {id} not found");
                }

                await _orderService.DeleteOrderAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order {Id}", id);
                return StatusCode(500, "An error occurred while deleting the order");
            }
        }
    }
} 