using usermanagement_api.DTOs;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public interface IOrderService
    {
        Task<PagedResult<OrderDto>> GetAdminOrdersAsync(int year, string? status, int page, int pageSize);
        Task<List<OrderDto>> GetMyOrdersAsync(int userId, int year, string? status);
        Task<OrderDto?> GetByIdAsync(int id, int userId, bool canViewAll);
        Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request);
        Task<bool> UpdateStatusAsync(int id, string status);
    }
}
