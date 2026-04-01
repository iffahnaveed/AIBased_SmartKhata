using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartKhata.Models
{
    [Table("shop_settings")]
    public class ShopSettings
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("shop_name")]
        public string ShopName { get; set; } = string.Empty;

        [Column("owner_name")]
        public string OwnerName { get; set; } = string.Empty;

        [Column("phone_number")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Column("city")]
        public string City { get; set; } = string.Empty;

        [Column("currency")]
        public string Currency { get; set; } = string.Empty;

        [Column("password")]
        public string Password { get; set; } = string.Empty;
    }
}