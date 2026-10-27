using System.ComponentModel.DataAnnotations;

namespace usermanagement_api.Models
{
    public class LoginRequest
    {
        [Required]
        public string UserEmail { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
