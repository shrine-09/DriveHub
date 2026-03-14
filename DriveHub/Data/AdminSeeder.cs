using DriveHub.Models;
using Microsoft.EntityFrameworkCore;

namespace DriveHub.Data;

public static class AdminSeeder
{
    public static async Task SeedAdminAsync(ApplicationDbContext context)
    {
        const string adminEmail = "admin@drivehub.com";
        const string adminPassword = "Admin@123";

        var existingAdmin = await context.Users
            .FirstOrDefaultAsync(u => u.UserEmail == adminEmail);

        if (existingAdmin != null)
            return;

        var admin = new User
        {
            UserName = "System Admin",
            UserEmail = adminEmail,
            UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            UserRole = "Admin"
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }
}