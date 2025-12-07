using DriveHub.Areas.Admin.Models;
using DriveHub.Areas.Users.Models;
using Microsoft.EntityFrameworkCore;

namespace DriveHub.Data;

public class ApplicationDbContext : DbContext
{
    private readonly IConfiguration _config;
    
    public DbSet<User> Users { get; set; }
    public DbSet<DrivingCenter> DrivingCenters { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration config)
        : base(options)
    {
        _config = config;
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var email = _config["AdminUser:Email"];
        var password = _config["AdminUser:Password"];

        var adminUser = new User
        {
            UserId = 1,
            UserName = "admin",
            UserEmail = email,
            UserRole = "Admin",
            UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
        };

        modelBuilder.Entity<User>().HasData(adminUser);
    }
}
