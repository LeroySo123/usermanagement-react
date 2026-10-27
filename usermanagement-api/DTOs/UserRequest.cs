using System.ComponentModel.DataAnnotations;

namespace usermanagement_api.DTOs
{
    public class UserRequest
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage =
       "Name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [StringLength(50, ErrorMessage =
        "Email cannot exceed 50 characters.")]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(
    @"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$",
    ErrorMessage = "Password must be at least 6 characters and contain uppercase, lowercase, and numeric characters."
)]
        public string? Password { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Role is required.")]
        public int RoleId { get; set; }
    }
}
