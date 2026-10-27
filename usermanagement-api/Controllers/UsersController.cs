
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

using Microsoft.AspNetCore.Mvc;
using usermanagement_api.DTOs;
using usermanagement_api.Models;
using usermanagement_api.Services;

namespace UserManagement.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin, SuperAdmin")]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<UserDto>>> GetUsers(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1)
            return BadRequest("Page must be greater than 0.");

        if (pageSize < 1 || pageSize > 100)
            return BadRequest("PageSize must be between 1 and 100.");

        var result = await _service.GetAllAsync(
            search, page, pageSize);

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _service.GetByIdAsync(id);

        if (user is null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult<UserDto>> CreateUser(
        UserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            ModelState.AddModelError("Name", "Name is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            ModelState.AddModelError("Email", "Email is required.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (await _service.EmailExistsAsync(request.Email))
        {
            return Conflict(new
            {
                message = "Email already exists.",
                errors = new Dictionary<string, string[]>
                {
                    ["Email"] = new[] { "Email already exists." }
                }
            });
        }

        var user = await _service.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetUser),
            new { id = user.Id },
            user
        );
    }

    [HttpPut("{id:int}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateUser(
        int id,
        UserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            ModelState.AddModelError("Name", "Name is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            ModelState.AddModelError("Email", "Email is required.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var existing = await _service.GetByIdAsync(id);

        if (existing is null)
            return NotFound(new
            {
                message = "User not found."
            });

        if (await _service.EmailExistsAsync(request.Email, id))
        {
            return Conflict(new
            {
                message = "Email already exists.",
                errors = new Dictionary<string, string[]>
                {
                    ["Email"] = new[] { "Email already exists." }
                }
            });
        }

        var updated = await _service.UpdateAsync(id, request);

        if (!updated)
            return NotFound(new { message = "User not found." });

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
