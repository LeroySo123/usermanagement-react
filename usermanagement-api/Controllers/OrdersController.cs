using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using usermanagement_api.DTOs;
using usermanagement_api.Services;

namespace usermanagement_api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> GetAdminOrders(
            [FromQuery] int? year = null,
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var selectedYear = year ?? DateTime.UtcNow.Year;
            if (!IsValidYear(selectedYear))
            {
                return BadRequest("Year is invalid.");
            }

            if (page < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest("Page must be greater than 0 and pageSize must be between 1 and 100.");
            }

            try
            {
                return Ok(await _orderService.GetAdminOrdersAsync(selectedYear, status, page, pageSize));
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyOrders(
            [FromQuery] int? year = null,
            [FromQuery] string? status = null)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var selectedYear = year ?? DateTime.UtcNow.Year;
            if (!IsValidYear(selectedYear))
            {
                return BadRequest("Year is invalid.");
            }

            try
            {
                return Ok(await _orderService.GetMyOrdersAsync(userId, selectedYear, status));
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            var canViewAll = User.IsInRole("Admin") || User.IsInRole("SuperAdmin");
            var order = await _orderService.GetByIdAsync(id, userId, canViewAll);
            return order is null ? NotFound() : Ok(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized();
            }

            try
            {
                var order = await _orderService.CreateAsync(userId, request);
                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpPatch("{id:int}/status")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusRequest request)
        {
            try
            {
                var updated = await _orderService.UpdateStatusAsync(id, request.Status);
                return updated ? NoContent() : NotFound();
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
            catch (InvalidOperationException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        private bool TryGetUserId(out int userId)
        {
            return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
        }

        private static bool IsValidYear(int year)
        {
            return year >= 1900 && year <= DateTime.UtcNow.Year;
        }
    }
}
