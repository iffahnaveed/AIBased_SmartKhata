using Microsoft.EntityFrameworkCore;
using SmartKhata.Models;

namespace SmartKhata.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ShopSettings> ShopSettings { get; set; }
        public DbSet<StockItem> StockItems { get; set; }
        public DbSet<SaleEntry> SaleEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // StockItem
            modelBuilder.Entity<StockItem>()
                .ToTable("stock_items")
                .HasKey(x => x.Id);

            modelBuilder.Entity<StockItem>()
                .Property(x => x.Id)
                .UseIdentityColumn();

            // SaleEntry
            modelBuilder.Entity<SaleEntry>()
                .ToTable("sale_entries")
                .HasKey(x => x.Id);

            modelBuilder.Entity<SaleEntry>()
                .Property(x => x.Id)
                .UseIdentityColumn();
        }
    }
}