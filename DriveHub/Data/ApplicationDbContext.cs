using DriveHub.Models;
using Microsoft.EntityFrameworkCore;

namespace DriveHub.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<DrivingCenter> DrivingCenters { get; set; }
    public DbSet<DrivingCenterApplication> DrivingCenterApplications { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DrivingCenter>()
            .HasOne(dc => dc.User)
            .WithOne(u => u.DrivingCenter)
            .HasForeignKey<DrivingCenter>(dc => dc.UserId);

        modelBuilder.Entity<DrivingCenter>()
            .HasIndex(dc => dc.UserId)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.UserEmail)
            .IsUnique();

        modelBuilder.Entity<DrivingCenter>()
            .HasIndex(dc => dc.CompanyEmail)
            .IsUnique(false);

        modelBuilder.Entity<DrivingCenterApplication>()
            .HasIndex(a => a.CompanyEmail)
            .IsUnique(false);
        
        modelBuilder.Entity<PasswordResetToken>()
            .HasOne(prt => prt.User)
            .WithMany(u => u.PasswordResetTokens)
            .HasForeignKey(prt => prt.UserId);

        modelBuilder.Entity<PasswordResetToken>()
            .HasIndex(prt => prt.TokenHash)
            .IsUnique();
    }
}