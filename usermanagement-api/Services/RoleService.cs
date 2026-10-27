using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using usermanagement_api.Data;
using usermanagement_api.DTOs;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public class RoleService
    {
        private readonly AppDbContext _context;


        public RoleService(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        public async Task<List<Role>> GetAllAsync()
        {
            try
            {
                var query = await _context.Roles.Where(r => r.Id != 3)
                    .AsNoTracking().ToListAsync();

                return query;
            }
            catch (TimeoutException)
            {
                throw new Exception("Database operation timed out. Please try again later.");

            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"An error occurred while fetching users: {ex.Message}");
                throw new Exception("An error occurred while fetching users. Please try again later.");
            }
        }
    }
}
