// Controllers/StockController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartKhata.Data;
using SmartKhata.Models;

namespace SmartKhata.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/stock
        // Returns all stock items ordered by name
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _context.StockItems
                .OrderBy(x => x.Name)
                .ToListAsync();

            return Ok(items);
        }

        // GET api/stock/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.StockItems.FindAsync(id);
            if (item == null)
                return NotFound(new { message = "Stock item not found" });

            return Ok(item);
        }

        // POST api/stock
        // Add a new stock item
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StockItemRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = new StockItem
            {
                Name          = request.Name.Trim(),
                Category      = request.Category,
                Quantity      = request.Quantity,
                Unit          = request.Unit,
                PurchasePrice = request.PurchasePrice,
                SellingPrice  = request.SellingPrice,
                LastUpdated   = DateTime.UtcNow,
                CreatedAt     = DateTime.UtcNow,
            };

            _context.StockItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        // PUT api/stock/5
        // Update an existing stock item
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StockItemRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _context.StockItems.FindAsync(id);
            if (item == null)
                return NotFound(new { message = "Stock item not found" });

            item.Name          = request.Name.Trim();
            item.Category      = request.Category;
            item.Quantity      = request.Quantity;
            item.Unit          = request.Unit;
            item.PurchasePrice = request.PurchasePrice;
            item.SellingPrice  = request.SellingPrice;
            item.LastUpdated   = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // PATCH api/stock/5/quick-update
        // Add or subtract quantity only (Quick Update panel)
        [HttpPatch("{id}/quick-update")]
        public async Task<IActionResult> QuickUpdate(int id, [FromBody] QuickUpdateRequest request)
        {
            var item = await _context.StockItems.FindAsync(id);
            if (item == null)
                return NotFound(new { message = "Stock item not found" });

            if (request.Action == "add")
                item.Quantity += request.Quantity;
            else if (request.Action == "subtract")
                item.Quantity = Math.Max(0, item.Quantity - request.Quantity);
            else
                return BadRequest(new { message = "Action must be 'add' or 'subtract'" });

            item.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // DELETE api/stock/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.StockItems.FindAsync(id);
            if (item == null)
                return NotFound(new { message = "Stock item not found" });

            _context.StockItems.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}