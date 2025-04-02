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
        private readonly IProductService _productService;

        public OrderController(
            IOrderService orderService, 
            IMapper mapper,
            ILogger<OrderController> logger,
            IProductService productService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _logger = logger;
            _productService = productService;
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
                
                // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng (vẫn giữ phần này để đảm bảo không tạo đơn hàng khi không đủ hàng)
                foreach (var item in createOrderDTO.Items)
                {
                    var product = await _productService.GetProductByIdAsync(item.ProductId);
                    if (product == null)
                    {
                        return BadRequest($"Sản phẩm với ID {item.ProductId} không tồn tại");
                    }
                    
                    if (product.Stock == null || product.Stock < item.Quantity)
                    {
                        return BadRequest($"Sản phẩm {product.ProductName} chỉ còn {product.Stock} sản phẩm trong kho");
                    }
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
                
                // Không trừ stock ở đây nữa, vì sẽ trừ khi thanh toán thành công

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

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusDTO statusDTO)
        {
            try
            {
                if (statusDTO == null || string.IsNullOrEmpty(statusDTO.Status))
                {
                    return BadRequest("Order status is required");
                }

                // Validate the status value
                string[] validStatuses = new[] { "pending", "delivering", "complete", "failed" };
                if (!validStatuses.Contains(statusDTO.Status.ToLower()))
                {
                    return BadRequest($"Invalid status. Valid values are: {string.Join(", ", validStatuses)}");
                }

                // Check if order exists without loading related entities
                var orderExists = await _orderService.OrderExistsAsync(id);
                if (!orderExists)
                {
                    return NotFound($"Order with ID {id} not found");
                }

                // Use the specialized method for updating status
                await _orderService.UpdateOrderStatusAsync(id, statusDTO.Status);
                
                return Ok(new { message = $"Order status updated to {statusDTO.Status}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {Id}", id);
                return StatusCode(500, "An error occurred while updating the order status");
            }
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound($"Không tìm thấy đơn hàng với ID {id}");
                }

                // Kiểm tra trạng thái đơn hàng hiện tại
                if (order.Status == "Cancelled" || order.Status == "Completed" || order.Status == "Delivered")
                {
                    return BadRequest($"Không thể hủy đơn hàng có trạng thái {order.Status}");
                }

                // Cập nhật trạng thái đơn hàng thành "Cancelled"
                await _orderService.UpdateOrderStatusAsync(id, "Cancelled");

                // Khôi phục số lượng tồn kho cho từng sản phẩm trong đơn hàng
                foreach (var orderDetail in order.OrderDetails)
                {
                    await _productService.RestoreProductStockAsync(orderDetail.ProductId, orderDetail.Quantity);
                }

                return Ok(new { message = "Đơn hàng đã được hủy thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi hủy đơn hàng {Id}", id);
                return StatusCode(500, "Đã xảy ra lỗi khi hủy đơn hàng");
            }
        }
    }
} 