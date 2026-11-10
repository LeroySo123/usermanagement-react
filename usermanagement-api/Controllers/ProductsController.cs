using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using usermanagement_api.DTOs;
using usermanagement_api.Services;

namespace usermanagement_api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveProducts()
        {
            return Ok(await _productService.GetAllAsync(includeInactive: false));
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> GetAllProducts()
        {
            return Ok(await _productService.GetAllAsync(includeInactive: true));
        }

        [HttpPost]
        [Authorize(Roles = "Admin, SuperAdmin")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateProduct(ProductRequest request)
        {
            var product = await _productService.CreateAsync(request);
            return Created($"/api/products/{product.Id}", product);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProduct(int id, ProductRequest request)
        {
            var updated = await _productService.UpdateAsync(id, request);
            return updated ? NoContent() : NotFound();
        }

        [HttpPatch("{id:int}/active")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetProductActive(int id, ProductActiveRequest request)
        {
            var updated = await _productService.SetActiveAsync(id, request.IsActive);
            return updated ? NoContent() : NotFound();
        }
    }
}
