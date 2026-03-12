using DriveHub.Areas.DrivingCenters.DTOs;
using DriveHub.Areas.DrivingCenters.Models;
using DriveHub.Data;
using Microsoft.AspNetCore.Mvc;

namespace DriveHub.Areas.DrivingCenters.Controllers;

[ApiController]
[Route("api/drivingcenters/[controller]")]
public class DrivingCenterController : ControllerBase
{
    public readonly ApplicationDbContext _context;

    public DrivingCenterController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] DrivingCenterRegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var center = new DrivingCenter()
        {
            CompanyName = dto.CompanyName,
            CompanyContact = dto.CompanyContact,
            CompanyEmail = dto.CompanyEmail,
            RegistrationNumber = dto.RegistrationNumber,
            CompanyType = dto.CompanyType,
        };
        
        _context.DrivingCenters.Add(center);
        await _context.SaveChangesAsync();
        
        return Ok(new {Message = "Driving Center registered successfully!"});
    }
}