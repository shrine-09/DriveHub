using DriveHub.Areas.Admin.DTOs;
using DriveHub.Data;
using DriveHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DriveHub.Areas.Admin.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("pending-driving-center-applications")]
    public async Task<IActionResult> GetPendingDrivingCenterApplications()
    {
        var applications = await _context.DrivingCenterApplications
            .Where(a => a.Status == "Pending")
            .OrderBy(a => a.SubmittedAt)
            .Select(a => new
            {
                a.Id,
                a.CompanyName,
                a.RegistrationNumber,
                a.CompanyEmail,
                a.CompanyContact,
                a.CompanyType,
                a.Status,
                a.SubmittedAt
            })
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("driving-center-applications")]
    public async Task<IActionResult> GetAllDrivingCenterApplications()
    {
        var applications = await _context.DrivingCenterApplications
            .OrderByDescending(a => a.SubmittedAt)
            .Select(a => new
            {
                a.Id,
                a.CompanyName,
                a.RegistrationNumber,
                a.CompanyEmail,
                a.CompanyContact,
                a.CompanyType,
                a.Status,
                a.AdminRemarks,
                a.SubmittedAt,
                a.ReviewedAt
            })
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("driving-center-applications/{id}")]
    public async Task<IActionResult> GetDrivingCenterApplicationById(int id)
    {
        var application = await _context.DrivingCenterApplications
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.CompanyName,
                a.RegistrationNumber,
                a.CompanyEmail,
                a.CompanyContact,
                a.CompanyType,
                a.Status,
                a.AdminRemarks,
                a.SubmittedAt,
                a.ReviewedAt
            })
            .FirstOrDefaultAsync();

        if (application == null)
            return NotFound(new { message = "Application not found." });

        return Ok(application);
    }

    [HttpPut("approve-driving-center-application/{id}")]
    public async Task<IActionResult> ApproveDrivingCenterApplication(int id)
    {
        var application = await _context.DrivingCenterApplications
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
            return NotFound(new { message = "Application not found." });

        if (application.Status != "Pending")
            return BadRequest(new { message = "This application has already been reviewed." });

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserEmail.ToLower() == application.CompanyEmail.ToLower());

        if (existingUser != null)
            return BadRequest(new { message = "A user account with this email already exists." });

        var existingCenter = await _context.DrivingCenters
            .FirstOrDefaultAsync(dc => dc.CompanyEmail.ToLower() == application.CompanyEmail.ToLower());

        if (existingCenter != null)
            return BadRequest(new { message = "A driving center with this email already exists." });

        var temporaryPassword = GenerateTemporaryPassword();

        var user = new User
        {
            UserName = application.CompanyName,
            UserEmail = application.CompanyEmail.Trim().ToLower(),
            UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
            MustChangePassword = true,
            UserRole = "DrivingCenter"
        };

        var drivingCenter = new DrivingCenter
        {
            User = user,
            CompanyName = application.CompanyName,
            RegistrationNumber = application.RegistrationNumber,
            CompanyEmail = application.CompanyEmail.Trim().ToLower(),
            CompanyContact = application.CompanyContact,
            CompanyType = application.CompanyType,
            IsVerified = true
            
        };

        application.Status = "Approved";
        application.ReviewedAt = DateTime.UtcNow;
        application.AdminRemarks = null;

        _context.Users.Add(user);
        _context.DrivingCenters.Add(drivingCenter);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Driving center application approved successfully.",
            loginEmail = user.UserEmail,
            temporaryPassword = temporaryPassword
        });
    }

    [HttpPut("reject-driving-center-application/{id}")]
    public async Task<IActionResult> RejectDrivingCenterApplication(
        int id,
        [FromBody] RejectDrivingCenterApplicationDto dto)
    {
        var application = await _context.DrivingCenterApplications
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
            return NotFound(new { message = "Application not found." });

        if (application.Status != "Pending")
            return BadRequest(new { message = "This application has already been reviewed." });

        application.Status = "Rejected";
        application.AdminRemarks = dto.AdminRemarks;
        application.ReviewedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Driving center application rejected successfully."
        });
    }
    
    [HttpGet("dashboard-summary")]
    public async Task<IActionResult> GetDashboardSummary()
    {
        var totalUsers = await _context.Users.CountAsync(u => u.UserRole == "User");
        var totalDrivingCenters = await _context.DrivingCenters.CountAsync();
        var pendingApplications = await _context.DrivingCenterApplications.CountAsync(a => a.Status == "Pending");

        return Ok(new
        {
            totalUsers,
            totalDrivingCenters,
            pendingApplications
        });
    }

    private static string GenerateTemporaryPassword()
    {
        const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string lower = "abcdefghijklmnopqrstuvwxyz";
        const string numbers = "0123456789";
        const string special = "@#$%&*!?";
        var allChars = upper + lower + numbers + special;

        var random = new Random();

        var passwordChars = new List<char>
        {
            upper[random.Next(upper.Length)],
            lower[random.Next(lower.Length)],
            numbers[random.Next(numbers.Length)],
            special[random.Next(special.Length)]
        };

        while (passwordChars.Count < 10)
        {
            passwordChars.Add(allChars[random.Next(allChars.Length)]);
        }

        return new string(passwordChars
            .OrderBy(_ => random.Next())
            .ToArray());
    }
}