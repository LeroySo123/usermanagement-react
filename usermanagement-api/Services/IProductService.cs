using usermanagement_api.DTOs;

namespace usermanagement_api.Services
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync(bool includeInactive);
        Task<ProductDto> CreateAsync(ProductRequest request);
        Task<bool> UpdateAsync(int id, ProductRequest request);
        Task<bool> SetActiveAsync(int id, bool isActive);
    }
}
