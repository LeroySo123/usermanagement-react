using Microsoft.EntityFrameworkCore;
using usermanagement_api.Data;
using usermanagement_api.DTOs;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<OrderDto>> GetAdminOrdersAsync(
            int year,
            string? status,
            int page,
            int pageSize)
        {
            var query = ApplyFilters(_context.Orders.AsNoTracking(), year, status)
                .Include(order => order.User)
                .Include(order => order.Items)
                .OrderByDescending(order => order.CreatedAtUtc);

            var totalCount = await query.CountAsync();
            var orders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<OrderDto>
            {
                Items = orders.Select(Map).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<List<OrderDto>> GetMyOrdersAsync(int userId, int year, string? status)
        {
            var orders = await ApplyFilters(
                    _context.Orders.AsNoTracking().Where(order => order.UserId == userId),
                    year,
                    status)
                .Include(order => order.Items)
                .OrderByDescending(order => order.CreatedAtUtc)
                .ToListAsync();

            return orders.Select(Map).ToList();
        }

        public async Task<OrderDto?> GetByIdAsync(int id, int userId, bool canViewAll)
        {
            var order = await _context.Orders
                .AsNoTracking()
                .Where(order => order.Id == id && (canViewAll || order.UserId == userId))
                .Include(order => order.User)
                .Include(order => order.Items)
                .FirstOrDefaultAsync();

            return order is null ? null : Map(order);
        }

        public async Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request)
        {
            var productIds = request.Items.Select(item => item.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(product => product.IsActive && productIds.Contains(product.Id))
                .ToDictionaryAsync(product => product.Id);

            if (products.Count != productIds.Count)
            {
                throw new ArgumentException("One or more selected products are unavailable.");
            }

            var order = new Order
            {
                OrderNumber = Guid.NewGuid().ToString("N"),
                UserId = userId,
                Status = OrderStatus.Pending,
                CreatedAtUtc = DateTime.UtcNow,
                CurrencyCode = "USD"
            };

            foreach (var requestedItem in request.Items)
            {
                var product = products[requestedItem.ProductId];
                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductNameSnapshot = product.Name,
                    Quantity = requestedItem.Quantity,
                    UnitPrice = product.Price
                });
            }

            order.TotalAmount = order.Items.Sum(item => item.UnitPrice * item.Quantity);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Map(order);
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            if (!Enum.TryParse<OrderStatus>(status, true, out var newStatus) || !Enum.IsDefined(newStatus))
            {
                throw new ArgumentException("Invalid order status.");
            }

            var order = await _context.Orders.FindAsync(id);
            if (order is null)
            {
                return false;
            }

            var validTransition = order.Status switch
            {
                OrderStatus.Pending => newStatus is OrderStatus.Processing or OrderStatus.Cancelled,
                OrderStatus.Processing => newStatus is OrderStatus.Completed or OrderStatus.Cancelled,
                _ => false
            };

            if (!validTransition)
            {
                throw new InvalidOperationException("The order cannot transition to the requested status.");
            }

            order.Status = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        private static IQueryable<Order> ApplyFilters(IQueryable<Order> query, int year, string? status)
        {
            var yearStart = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var nextYearStart = yearStart.AddYears(1);
            query = query.Where(order => order.CreatedAtUtc >= yearStart && order.CreatedAtUtc < nextYearStart);

            if (!string.IsNullOrWhiteSpace(status))
            {
                if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus) || !Enum.IsDefined(parsedStatus))
                {
                    throw new ArgumentException("Invalid order status.");
                }

                query = query.Where(order => order.Status == parsedStatus);
            }

            return query;
        }

        private static OrderDto Map(Order order) => new()
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            UserId = order.UserId,
            CustomerName = order.User?.Name ?? string.Empty,
            Status = order.Status.ToString(),
            CreatedAtUtc = order.CreatedAtUtc,
            TotalAmount = order.TotalAmount,
            CurrencyCode = order.CurrencyCode,
            Items = order.Items.Select(item => new OrderItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.ProductNameSnapshot,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            }).ToList()
        };
    }
}
