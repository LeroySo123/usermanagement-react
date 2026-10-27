using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using usermanagement_api.Data;
using usermanagement_api.DTOs;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;


        public UserService(AppDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        // GET ALL
        public async Task<PagedResult<UserDto>> GetAllAsync(
            string? search,
            int page,
            int pageSize)
        {
            try
            {
                IQueryable<User> query = _context.Users
                    .Include(u => u.Role)
                    .AsNoTracking();

                // Search by Name or Email
                if (!string.IsNullOrWhiteSpace(search))
                {
                    string keyword = search.Trim();

                    query = query.Where(u =>
                        u.Name.Contains(keyword) ||
                        u.Email.Contains(keyword)
                    );
                }

                // Total matching records before pagination
                int totalCount = await query.CountAsync();

                // Pagination
                var users = await query
                    .OrderBy(u => u.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        RoleId = u.RoleId,
                        RoleName = u.Role.RoleName ?? string.Empty
                    })
                    .ToListAsync();

                return new PagedResult<UserDto>
                {
                    Items = users,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(
                        (double)totalCount / pageSize)
                };
            }
            catch (TimeoutException)
            {
                throw new Exception("Database operation timed out. Please try again later.");

            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework)
                Console.Error.WriteLine($"An error occurred while fetching users: {ex.Message}");
                throw new Exception("An error occurred while fetching users. Please try again later.");
            }
        }

        // GET BY ID
        public async Task<UserDto?> GetByIdAsync(int id)
        {
            return await _context.Users
                .AsNoTracking()
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    RoleId = u.RoleId
                })
                .FirstOrDefaultAsync(u => u.Id == id);
        }


        public async Task<UserDto> CreateAsync(UserRequest request)
        {
            if (String.IsNullOrEmpty(request.Password))
                throw new ArgumentException("Password is required.", nameof(request.Password));

            var user = new User
            {
                Name = request.Name.Trim(),
                Email = request.Email.Trim(),
                RoleId = request.RoleId
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);


            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                RoleId = user.RoleId 
            };
        }

        // UPDATE
        public async Task<bool> UpdateAsync(int id, UserRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user is null)
                return false;

            user.Name = request.Name.Trim();
            user.Email = request.Email.Trim();
            user.RoleId = request.RoleId;
            if(!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            }

            await _context.SaveChangesAsync();

            return true;
        }

        // DELETE
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user is null)
                return false;

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeUserId = null)
        {
            string normalizedEmail = email.Trim();

            return await _context.Users
                .AsNoTracking()
                .AnyAsync(u =>
                    u.Email == normalizedEmail &&
                    (!excludeUserId.HasValue ||
                     u.Id != excludeUserId.Value)
                );
        }


        // GET BY Email
        public async Task<User?> GetUserByEmailAsync(string userEmail)
        {
            return await _context.Users
                .Include(u => u.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == userEmail);
        }
    }
}
