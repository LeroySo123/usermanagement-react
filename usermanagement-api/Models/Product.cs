namespace usermanagement_api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NormalizedName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
