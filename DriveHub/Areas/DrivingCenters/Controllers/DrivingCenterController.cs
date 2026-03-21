using System.Security.Claims;
using DriveHub.Areas.DrivingCenters.DTOs;
using DriveHub.Data;
using DriveHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace DriveHub.Areas.DrivingCenters.Controllers;

[ApiController]
[Route("api/drivingcenters/[controller]")]
public class DrivingCenterController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DrivingCenterController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "DrivingCenter")]
    [HttpGet("my-profile")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .Include(dc => dc.Packages)
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        return Ok(new
        {
            center.Id,
            center.CompanyName,
            center.CompanyEmail,
            center.CompanyContact,
            center.CompanyType,
            center.Address,
            center.District,
            center.Municipality,
            center.Latitude,
            center.Longitude,
            center.Description,
            center.IsProfileComplete,
            packages = center.Packages.Select(p => new
            {
                p.Id,
                p.ServiceType,
                p.DurationType,
                p.PriceNpr
            })
        });
    }

    [Authorize(Roles = "DrivingCenter")]
    [HttpPost("setup-profile")]
    public async Task<IActionResult> SetupProfile([FromBody] DrivingCenterProfileSetupDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .Include(dc => dc.Packages)
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        if (dto.Latitude is < -90 or > 90)
            return BadRequest(new { message = "Latitude must be between -90 and 90." });

        if (dto.Longitude is < -180 or > 180)
            return BadRequest(new { message = "Longitude must be between -180 and 180." });

        var allowedServices = new[] { "Bike", "Car" };
        var allowedDurations = new[] { "2Weeks", "1Month" };

        if (dto.Packages == null || dto.Packages.Count == 0)
            return BadRequest(new { message = "At least one service package is required." });

        foreach (var pkg in dto.Packages)
        {
            if (!allowedServices.Contains(pkg.ServiceType))
                return BadRequest(new { message = $"Invalid service type: {pkg.ServiceType}" });

            if (!allowedDurations.Contains(pkg.DurationType))
                return BadRequest(new { message = $"Invalid duration type: {pkg.DurationType}" });

            if (pkg.PriceNpr <= 0)
                return BadRequest(new { message = "Package price must be greater than 0." });
        }

        center.Address = dto.Address.Trim();
        center.District = dto.District.Trim();
        center.Municipality = dto.Municipality.Trim();
        center.Latitude = dto.Latitude;
        center.Longitude = dto.Longitude;
        center.Description = string.IsNullOrWhiteSpace(dto.Description)
            ? null
            : dto.Description.Trim();
        center.IsProfileComplete = true;

        _context.DrivingCenterPackages.RemoveRange(center.Packages);

        var newPackages = dto.Packages.Select(pkg => new DrivingCenterPackage
        {
            DrivingCenterId = center.Id,
            ServiceType = pkg.ServiceType.Trim(),
            DurationType = pkg.DurationType.Trim(),
            PriceNpr = pkg.PriceNpr
        }).ToList();

        await _context.DrivingCenterPackages.AddRangeAsync(newPackages);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Driving center profile setup completed successfully." });
    }
    
    [Authorize(Roles = "DrivingCenter")]
    [HttpGet("dashboard-summary")]
    public async Task<IActionResult> GetDashboardSummary()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .Include(dc => dc.Packages)
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        return Ok(new
        {
            center.CompanyName,
            center.IsProfileComplete,
            center.Address,
            center.District,
            center.Municipality,
            packagesCount = center.Packages.Count
        });
    }
    
    [Authorize(Roles = "DrivingCenter")]
    [HttpGet("pending-bookings")]
    public async Task<IActionResult> GetPendingBookings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        var bookings = await _context.Bookings
            .Include(b => b.User)
            .Where(b => b.DrivingCenterId == center.Id && b.Status == "PendingStart")
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new
            {
                b.BookingId,
                b.ServiceType,
                b.DurationType,
                b.PriceNpr,
                b.StartDate,
                b.EndDate,
                b.Status,
                b.CreatedAt,
                user = new
                {
                    b.User.UserId,
                    b.User.UserName,
                    b.User.UserEmail
                }
            })
            .ToListAsync();

        return Ok(bookings);
    }
    
    [Authorize(Roles = "DrivingCenter")]
    [HttpPut("start-training/{bookingId}")]
    public async Task<IActionResult> StartTraining(int bookingId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b =>
                b.BookingId == bookingId &&
                b.DrivingCenterId == center.Id);

        if (booking == null)
            return NotFound(new { message = "Booking not found." });

        if (booking.Status != "PendingStart")
            return BadRequest(new { message = "Only pending learners can be started." });

        booking.Status = "Active";

        await _context.SaveChangesAsync();

        return Ok(new { message = "Training started successfully." });
    }
    
    [Authorize(Roles = "DrivingCenter")]
    [HttpGet("active-learners")]
    public async Task<IActionResult> GetActiveLearners()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        var learners = await _context.Bookings
            .Include(b => b.User)
            .Where(b => b.DrivingCenterId == center.Id && b.Status == "Active")
            .OrderByDescending(b => b.StartDate)
            .Select(b => new
            {
                b.BookingId,
                b.ServiceType,
                b.DurationType,
                b.PriceNpr,
                b.StartDate,
                b.EndDate,
                b.Status,
                user = new
                {
                    b.User.UserId,
                    b.User.UserName,
                    b.User.UserEmail
                }
            })
            .ToListAsync();

        return Ok(learners);
    }
    
    [Authorize(Roles = "DrivingCenter")]
    [HttpGet("inactive-learners")]
    public async Task<IActionResult> GetInactiveLearners()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        var learners = await _context.Bookings
            .Include(b => b.User)
            .Where(b =>
                b.DrivingCenterId == center.Id &&
                (b.Status == "Completed" || b.Status == "Cancelled"))
            .OrderByDescending(b => b.EndDate)
            .Select(b => new
            {
                b.BookingId,
                b.ServiceType,
                b.DurationType,
                b.PriceNpr,
                b.StartDate,
                b.EndDate,
                b.Status,
                user = new
                {
                    b.User.UserId,
                    b.User.UserName,
                    b.User.UserEmail
                }
            })
            .ToListAsync();

        return Ok(learners);
    }
}