using System.Security.Claims;
using DriveHub.Areas.DrivingCenters.DTOs;
using DriveHub.Data;
using DriveHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var center = await _context.DrivingCenters
            .Include(dc => dc.Packages)
            .FirstOrDefaultAsync(dc => dc.UserId == userId);

        if (center == null)
            return NotFound(new { message = "Driving center profile not found." });

        center.Address = dto.Address;
        center.District = dto.District;
        center.Municipality = dto.Municipality;
        center.Latitude = dto.Latitude;
        center.Longitude = dto.Longitude;
        center.Description = dto.Description;
        center.IsProfileComplete = true;

        _context.DrivingCenterPackages.RemoveRange(center.Packages);

        var newPackages = dto.Packages.Select(pkg => new DrivingCenterPackage
        {
            DrivingCenterId = center.Id,
            ServiceType = pkg.ServiceType,
            DurationType = pkg.DurationType,
            PriceNpr = pkg.PriceNpr
        }).ToList();

        await _context.DrivingCenterPackages.AddRangeAsync(newPackages);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Driving center profile setup completed successfully." });
    }
}