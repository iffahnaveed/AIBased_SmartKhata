using System.ComponentModel.DataAnnotations;

namespace SmartKhata.Models
{
    public class SaleEntryRequest
    {
        [Required]
        public string Product { get; set; } = string.Empty;

        public string Category { get; set; } = "General";

        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "pcs";

        public decimal SellingPrice { get; set; }

        public string PaymentType { get; set; } = "cash";
        public string Customer { get; set; } = string.Empty;

        public string Status { get; set; } = "paid";
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}