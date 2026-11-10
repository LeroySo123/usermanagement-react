using System.ComponentModel.DataAnnotations;

namespace usermanagement_api.DTOs
{
    public class UpdateOrderStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
