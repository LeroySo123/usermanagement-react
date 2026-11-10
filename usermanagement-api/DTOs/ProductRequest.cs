using System.ComponentModel.DataAnnotations;

namespace usermanagement_api.DTOs
{
    public class ProductRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "9999999999999999.99")]
        public decimal Price { get; set; }
    }
}
