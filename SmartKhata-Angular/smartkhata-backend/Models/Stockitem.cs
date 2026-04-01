// Models/StockItem.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartKhata.Models
{
    [Table("stock_items")]
    public class StockItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("category")]
        public string Category { get; set; } = "General";

        [Column("quantity")]
        public decimal Quantity { get; set; } = 0;

        [Column("unit")]
        public string Unit { get; set; } = "pcs";

        [Column("purchase_price")]
        public decimal PurchasePrice { get; set; } = 0;

        [Column("selling_price")]
        public decimal SellingPrice { get; set; } = 0;

        [Column("last_updated")]
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Computed — not stored in DB
        [NotMapped]
        public string Status => Quantity == 0 ? "out-of-stock"
                              : Quantity <= 10 ? "low-stock"
                              : "in-stock";
    }

    // ── Request / Response DTOs ──────────────────────────────

    public class StockItemRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "General";

        [Range(0, double.MaxValue)]
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "pcs";

        [Range(0, double.MaxValue)]
        public decimal PurchasePrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal SellingPrice { get; set; }
    }

    public class QuickUpdateRequest
    {
        [Required]
        public string Action { get; set; } = "add";   // "add" | "subtract"

        [Range(1, double.MaxValue)]
        public decimal Quantity { get; set; }
    }
}