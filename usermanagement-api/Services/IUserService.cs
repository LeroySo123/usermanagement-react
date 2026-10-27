using usermanagement_api.DTOs;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public interface IUserService
    {
        public Task<PagedResult<UserDto>> GetAllAsync(
    string? search,
    int page,
    int pageSize);
        public Task<UserDto?> GetByIdAsync(int id);
        public Task<User?> GetUserByEmailAsync(string userEmail);
        public Task<UserDto> CreateAsync(UserRequest request);
        public Task<bool> UpdateAsync(int id, UserRequest request);
        public Task<bool> DeleteAsync(int id);
        public Task<bool> EmailExistsAsync(string email, int? excludeUserId = null);
    }
}
