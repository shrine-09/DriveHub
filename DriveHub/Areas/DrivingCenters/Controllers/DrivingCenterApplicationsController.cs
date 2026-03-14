using DriveHub.Areas.DrivingCenters.DTOs;
using DriveHub.Data;
using DriveHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DriveHub.Areas.DrivingCenters.Controllers;

[ApiController]
[Route("api/drivingcenter-applications")]
public class DrivingCenterApplicationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DrivingCenterApplicationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] DrivingCenterSubmitDto dto)
    {
        var existingPending = await _context.DrivingCenterApplications.AnyAsync(a =>
            a.CompanyEmail == dto.CompanyEmail &&
            a.Status == "Pending");

        if (existingPending)
            return BadRequest("A pending application already exists for this email.");

        var existingApprovedCenter = await _context.DrivingCenters.AnyAsync(dc =>
            dc.CompanyEmail == dto.CompanyEmail);

        if (existingApprovedCenter)
            return BadRequest("This driving center is already registered.");

        var application = new DrivingCenterApplication
        {
            CompanyName = dto.CompanyName,
            RegistrationNumber = dto.RegistrationNumber,
            CompanyEmail = dto.CompanyEmail,
            CompanyContact = dto.CompanyContact,
            CompanyType = dto.CompanyType,
            Status = "Pending"
        };

        _context.DrivingCenterApplications.Add(application);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Application submitted successfully and is pending until admin approval." });
    }
}