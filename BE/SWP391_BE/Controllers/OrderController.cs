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

                // Áp dụng giảm giá nếu có mã khuyến mãi
                if (createOrderDTO.PromotionId.HasValue && createOrderDTO.PromotionDiscount.HasValue)
                {
                    totalAmount = totalAmount - createOrderDTO.PromotionDiscount.Value;
                }

                var order = new Order
                {
                    UserId = createOrderDTO.UserId,
                    OrderDate = DateTime.Now,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    PromotionId = createOrderDTO.PromotionId,
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

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusDTO statusDTO)
        {
            try
            {
                _logger.LogInformation("Received request to update order {OrderId} status to {Status}", id, statusDTO?.Status);

                if (statusDTO == null || string.IsNullOrEmpty(statusDTO.Status))
                {
                    return BadRequest(new { message = "Order status is required" });
                }

                // Normalize the status
                string requestedStatus = statusDTO.Status.ToLower();

                // Get the order with details
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = $"Order with ID {id} not found" });
                }

                // Map frontend to backend status values
                if (requestedStatus == "shipping") requestedStatus = "delivering";
                if (requestedStatus == "delivered") requestedStatus = "complete";

                // Get current order status (normalize it)
                string currentStatus = (order.Status?.ToLower() ?? "pending");

                _logger.LogInformation("Current status: {Current}, Requested: {Requested}",
                    currentStatus, requestedStatus);

                // Check if we're allowing cancellation - this should always be allowed
                bool isCancellation = requestedStatus == "cancelled";

                // Check if payment status is confirmed in the request
                bool paymentConfirmedInRequest = statusDTO.PaymentConfirmed == true;

                // If explicitly marked as payment confirmed in request or cancelling, skip payment checks
                if (!paymentConfirmedInRequest && !isCancellation)
                {
                    // Check if any payment is complete
                    bool isPaid = false;

                    if (order.Payments != null && order.Payments.Any())
                    {
                        isPaid = order.Payments.Any(p =>
                            (p.Status?.ToLower() == "paid" ||
                            p.Status?.ToLower() == "completed" ||
                            p.Status?.ToLower() == "đã thanh toán"));

                        _logger.LogInformation("Payment check from Payment records: {IsPaid}", isPaid);
                    }

                    // If no payment record found or payment not confirmed, return error
                    if (!isPaid)
                    {
                        _logger.LogWarning("Payment required for status change: {Current} → {Requested}",
                            currentStatus, requestedStatus);
                        return BadRequest(new { message = "Cannot update order status because payment is not confirmed" });
                    }
                }

                // Only these transitions should be restricted
                bool isValidTransition = true;

                // Cancelled/Failed/Complete are final states
                if (currentStatus == "cancelled" || currentStatus == "failed" || currentStatus == "complete")
                {
                    isValidTransition = false;
                }
                // From pending: can go to delivering, cancelled
                else if (currentStatus == "pending")
                {
                    isValidTransition = (requestedStatus == "delivering" ||
                                         requestedStatus == "cancelled");
                }
                // From delivering: can go to complete, cancelled
                else if (currentStatus == "delivering")
                {
                    isValidTransition = (requestedStatus == "complete" ||
                                         requestedStatus == "cancelled");
                }

                if (!isValidTransition)
                {
                    return BadRequest(new
                    {
                        message = $"Invalid transition: Cannot change status from '{currentStatus}' to '{requestedStatus}'"
                    });
                }

                // Update the status
                await _orderService.UpdateOrderStatusAsync(id, requestedStatus);
                _logger.LogInformation("Successfully updated order {OrderId} status to {Status}", id, requestedStatus);

                return Ok(new { message = $"Order status updated to {requestedStatus}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {Id}", id);
                return StatusCode(500, new
                {
                    message = "An error occurred while updating the order status",
                    details = ex.Message
                });
            }
        }

        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound($"Order with ID {id} not found");
                }

                // Kiểm tra trạng thái đơn hàng
                if (order.Status?.ToLower() == "delivering")
                {
                    return BadRequest("Không thể hủy đơn hàng khi đã chuyển sang 'Đang vận chuyển'.");
                }

                // Kiểm tra nếu đơn hàng đã bị hủy trước đó
                if (order.Status?.ToLower() == "cancelled")
                {
                    return BadRequest("Đơn hàng đã được hủy trước đó.");
                }

                // Cập nhật trạng thái đơn hàng thành "Cancelled"
                await _orderService.UpdateOrderStatusAsync(id, "Cancelled");

                // Khôi phục số lượng tồn kho (Stock) cho tất cả sản phẩm trong đơn hàng
                foreach (var orderDetail in order.OrderDetails)
                {
                    await _productService.RestoreProductStockAsync(orderDetail.ProductId, orderDetail.Quantity);
                }

                return Ok(new { message = $"Order with ID {id} has been cancelled, and stock has been restored." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order {Id}", id);
                return StatusCode(500, "An error occurred while cancelling the order: " + ex.Message);
            }
        }
    }
}