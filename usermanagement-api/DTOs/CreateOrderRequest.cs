using System.ComponentModel.DataAnnotations;

namespace usermanagement_api.DTOs
{
    public class CreateOrderRequest
    {
        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        [Range(1, int.MaxValue)]
        public int ProductId { get; set; }

        [Range(1, 1000)]
        public int Quantity { get; set; }
    }
}
