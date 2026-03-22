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
    public DbSet<DrivingCenterPackage> DrivingCenterPackages { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<TrainingSessionRecord> TrainingSessionRecords { get; set; }

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

        modelBuilder.Entity<DrivingCenterPackage>()
            .HasOne(p => p.DrivingCenter)
            .WithMany(dc => dc.Packages)
            .HasForeignKey(p => p.DrivingCenterId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PasswordResetToken>()
            .HasOne(prt => prt.User)
            .WithMany(u => u.PasswordResetTokens)
            .HasForeignKey(prt => prt.UserId);

        modelBuilder.Entity<PasswordResetToken>()
            .HasIndex(prt => prt.TokenHash)
            .IsUnique();

        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId);

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(rt => rt.TokenHash)
            .IsUnique();
        
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.DrivingCenter)
            .WithMany()
            .HasForeignKey(b => b.DrivingCenterId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<TrainingSessionRecord>()
            .HasOne(tsr => tsr.Booking)
            .WithMany()
            .HasForeignKey(tsr => tsr.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}