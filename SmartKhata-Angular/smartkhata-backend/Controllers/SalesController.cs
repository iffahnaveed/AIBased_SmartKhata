// Controllers/SalesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartKhata.Data;
using SmartKhata.Models;

namespace SmartKhata.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SalesController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/sales
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entries = await _context.SaleEntries
                .OrderByDescending(x => x.Date)
                .ThenByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(entries);
        }

        // GET api/sales/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entry = await _context.SaleEntries.FindAsync(id);
            if (entry == null)
                return NotFound(new { message = "Sale entry not found" });

            return Ok(entry);
        }

        // POST api/sales
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SaleEntryRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (request.PaymentType == "udhar" &&
                string.IsNullOrWhiteSpace(request.Customer))
                return BadRequest(new { message = "Customer name is required for Udhar sales" });

            var entry = new SaleEntry
            {
                Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc),
                Product      = request.Product.Trim(),
                Category     = request.Category,
                Quantity     = request.Quantity,
                Unit         = request.Unit,
                SellingPrice = request.SellingPrice,
                Total        = request.Quantity * request.SellingPrice,
                PaymentType  = request.PaymentType,
                Customer     = request.Customer.Trim(),
                Status       = request.Status,
                CreatedAt    = DateTime.UtcNow,
            };

            _context.SaleEntries.Add(entry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
        }

        // PUT api/sales/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SaleEntryRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entry = await _context.SaleEntries.FindAsync(id);
            if (entry == null)
                return NotFound(new { message = "Sale entry not found" });

            if (request.PaymentType == "udhar" &&
                string.IsNullOrWhiteSpace(request.Customer))
                return BadRequest(new { message = "Customer name is required for Udhar sales" });

            entry.Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc);
            entry.Product      = request.Product.Trim();
            entry.Category     = request.Category;
            entry.Quantity     = request.Quantity;
            entry.Unit         = request.Unit;
            entry.SellingPrice = request.SellingPrice;
            entry.Total        = request.Quantity * request.SellingPrice;
            entry.PaymentType  = request.PaymentType;
            entry.Customer     = request.Customer.Trim();
            entry.Status       = request.Status;

            await _context.SaveChangesAsync();
            return Ok(entry);
        }

        // DELETE api/sales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entry = await _context.SaleEntries.FindAsync(id);
            if (entry == null)
                return NotFound(new { message = "Sale entry not found" });

            _context.SaleEntries.Remove(entry);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}