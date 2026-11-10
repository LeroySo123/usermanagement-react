namespace usermanagement_api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public DateTime CreatedAtUtc { get; set; }
        public decimal TotalAmount { get; set; }
        public string CurrencyCode { get; set; } = "USD";
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
