using Microsoft.EntityFrameworkCore;
using QPortal.Helpers;
using QPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QPortal.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            modelBuilder.Entity<User>().HasData(new User
            {
                UserId = Guid.NewGuid().ToString(),
                FirstName = "Admin",
                LastName = "Pratik",
                DOB = DateTime.ParseExact("30/05/1996", "dd/MM/yyyy", null),
                IsAdmin = true,
                Address = "Sample Address",
                UserName = "admin@portal.com",
                Password = PasswordHash.HashPassword("Admin@1234")
            });
        }

        public DbSet<User> Users { get; set; }
    }
}
