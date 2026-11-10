using Microsoft.EntityFrameworkCore;
using usermanagement_api.Data;
using usermanagement_api.DTOs;
using usermanagement_api.Models;

namespace usermanagement_api.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductDto>> GetAllAsync(bool includeInactive)
        {
            var query = _context.Products.AsNoTracking();

            if (!includeInactive)
            {
                query = query.Where(product => product.IsActive);
            }

            return await query
                .OrderBy(product => product.Name)
                .Select(product => new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    IsActive = product.IsActive
                })
                .ToListAsync();
        }

        public async Task<ProductDto> CreateAsync(ProductRequest request)
        {
            var product = new Product
            {
                Name = request.Name.Trim(),
                Price = request.Price,
                IsActive = true
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Map(product);
        }

        public async Task<bool> UpdateAsync(int id, ProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null)
            {
                return false;
            }

            product.Name = request.Name.Trim();
            product.Price = request.Price;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetActiveAsync(int id, bool isActive)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null)
            {
                return false;
            }

            product.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        private static ProductDto Map(Product product) => new()
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            IsActive = product.IsActive
        };
    }
}
