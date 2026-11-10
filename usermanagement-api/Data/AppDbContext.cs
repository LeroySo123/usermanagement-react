    using usermanagement_api.Models;
    using Microsoft.EntityFrameworkCore;

    namespace usermanagement_api.Data
    {
        public class AppDbContext : DbContext
        {
            public AppDbContext(
                DbContextOptions<AppDbContext> options
            ) : base(options)
            {
            }

            public DbSet<User> Users { get; set; }
            public DbSet<Role> Roles { get; set; }
            public DbSet<Product> Products { get; set; }
            public DbSet<Order> Orders { get; set; }
            public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(
                ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<User>(entity =>
                {
                    entity.ToTable("UserAccout");

                    entity.HasKey(u => u.Id);

                    entity.Property(u => u.Name)
                        .IsRequired()
                        .HasMaxLength(50);

                    entity.Property(u => u.Email)
                        .IsRequired()
                        .HasMaxLength(50);
                });

                modelBuilder.Entity<Product>(entity =>
                {
                    entity.ToTable("Products", table =>
                    {
                        table.HasCheckConstraint("CK_Products_Price", "[Price] > 0");
                    });

                    entity.HasKey(p => p.Id);

                    entity.Property(p => p.Name)
                        .IsRequired()
                        .HasMaxLength(100);

                    entity.Property(p => p.NormalizedName)
                        .IsRequired()
                        .HasMaxLength(100);

                    entity.Property(p => p.Price)
                        .HasPrecision(18, 2);

                    entity.HasIndex(p => p.Name);
                    entity.HasIndex(p => p.NormalizedName)
                        .IsUnique();
                });

                modelBuilder.Entity<Order>(entity =>
                {
                    entity.ToTable("Orders", table =>
                    {
                        table.HasCheckConstraint("CK_Orders_TotalAmount", "[TotalAmount] >= 0");
                        table.HasCheckConstraint("CK_Orders_Status", "[Status] IN ('Pending', 'Processing', 'Completed', 'Cancelled')");
                    });

                    entity.HasKey(o => o.Id);

                    entity.Property(o => o.OrderNumber)
                        .IsRequired()
                        .HasMaxLength(32);

                    entity.HasIndex(o => o.OrderNumber)
                        .IsUnique();

                    entity.Property(o => o.Status)
                        .HasConversion<string>()
                        .HasMaxLength(20);

                    entity.Property(o => o.CreatedAtUtc)
                        .IsRequired();

                    entity.Property(o => o.TotalAmount)
                        .HasPrecision(18, 2);

                    entity.Property(o => o.CurrencyCode)
                        .IsRequired()
                        .HasMaxLength(3)
                        .IsFixedLength();

                    entity.HasOne(o => o.User)
                        .WithMany()
                        .HasForeignKey(o => o.UserId)
                        .OnDelete(DeleteBehavior.Restrict);

                    entity.HasIndex(o => new { o.UserId, o.CreatedAtUtc });
                    entity.HasIndex(o => new { o.CreatedAtUtc, o.Status });
                });

                modelBuilder.Entity<OrderItem>(entity =>
                {
                    entity.ToTable("OrderItems", table =>
                    {
                        table.HasCheckConstraint("CK_OrderItems_Quantity", "[Quantity] > 0");
                        table.HasCheckConstraint("CK_OrderItems_UnitPrice", "[UnitPrice] >= 0");
                    });

                    entity.HasKey(item => item.Id);

                    entity.Property(item => item.ProductNameSnapshot)
                        .IsRequired()
                        .HasMaxLength(100);

                    entity.Property(item => item.UnitPrice)
                        .HasPrecision(18, 2);

                    entity.HasOne(item => item.Order)
                        .WithMany(order => order.Items)
                        .HasForeignKey(item => item.OrderId)
                        .OnDelete(DeleteBehavior.Cascade);

                    entity.HasOne(item => item.Product)
                        .WithMany(product => product.OrderItems)
                        .HasForeignKey(item => item.ProductId)
                        .OnDelete(DeleteBehavior.Restrict);

                    entity.HasIndex(item => item.ProductId);
                });
            }
        }
    }
