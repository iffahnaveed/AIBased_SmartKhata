// Models/SaleEntry.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartKhata.Models
{
    [Table("sale_entries")]
    public class SaleEntry
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("date")]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("product")]
        public string Product { get; set; } = string.Empty;

        [Column("category")]
        public string Category { get; set; } = "General";

        [Column("quantity")]
        public decimal Quantity { get; set; } = 1;

        [Column("unit")]
        public string Unit { get; set; } = "pcs";

        [Column("selling_price")]
        public decimal SellingPrice { get; set; } = 0;

        [Column("total")]
        public decimal Total { get; set; } = 0;

        [Column("payment_type")]
        public string PaymentType { get; set; } = "cash";

        [Column("customer")]
        public string Customer { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = "paid";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}