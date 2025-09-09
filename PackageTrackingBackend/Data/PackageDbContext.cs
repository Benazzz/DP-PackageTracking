using Microsoft.EntityFrameworkCore;
using PackageTracking.Models;

namespace PackageTracking.Data
{
    public class PackageDbContext : DbContext
    {
        public PackageDbContext(DbContextOptions<PackageDbContext> options) : base(options)
        {
        }
        public DbSet<Package> Packages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Package>().OwnsMany(p => p.StatusHistory);
        }
    }
}
