using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using usermanagement_api.Data;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public class AuthService
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasher<User> _passwordHasher;


        public AuthService(IUserService userService, IPasswordHasher<User> passwordHasher)
        {
            _userService = userService;
            _passwordHasher = passwordHasher;
        }

        public async Task<ClaimsPrincipal?> LoginAsync(LoginRequest request)
        {
            var user = await _userService.GetUserByEmailAsync(request.UserEmail);

            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password
            );

            if (result == PasswordVerificationResult.Failed)
                return null;

            var claims = new List<Claim>
    {
        new Claim(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()),

        new Claim(
            ClaimTypes.Name,
            user.Name),

        new Claim(
            ClaimTypes.Email,
            user.Email),
    };

            if (user.Role != null)
            {
                claims.Add(new Claim(
                    ClaimTypes.Role,
                    user.Role.RoleName
                ));
            }


            var identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            return new ClaimsPrincipal(identity);
        }
    }
}
