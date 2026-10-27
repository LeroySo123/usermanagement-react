using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using usermanagement_api.DTOs;
using usermanagement_api.Models;
using usermanagement_api.Services;

namespace usermanagement_api.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, SuperAdmin")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RoleService _service;

        public RolesController(RoleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {

            var result = await _service.GetAllAsync();

            return Ok(result);
        }
    }
}
