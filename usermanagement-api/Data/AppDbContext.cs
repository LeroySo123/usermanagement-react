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
            }
        }
    }
