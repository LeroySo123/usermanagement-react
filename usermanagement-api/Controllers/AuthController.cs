using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using usermanagement_api.Models;
using usermanagement_api.Services;

namespace usermanagement_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;

        public AuthController(IConfiguration configuration, AuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequest request)
        {

            var principal = await _authService.LoginAsync(request);

            if (principal == null)
                return Unauthorized("Invalid email or password");


            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = false
                }
            );

            return Ok(new { username = principal.Identity.Name, role = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value,  message = "Login successful" });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            return Ok(new
            {
                username = User.Identity?.Name,
                email = User.FindFirstValue(ClaimTypes.Email),
                role = User.FindFirst(ClaimTypes.Role)?.Value
            });
        }

        [HttpPost("logout")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            return NoContent();
        }

        [HttpGet("csrf")]
        [AllowAnonymous]
        public IActionResult GetCsrfToken(
    [FromServices] IAntiforgery antiforgery)
        {
            var tokens = antiforgery.GetAndStoreTokens(HttpContext);

            return Ok(new
            {
                token = tokens.RequestToken
            });
        }
    }
}
