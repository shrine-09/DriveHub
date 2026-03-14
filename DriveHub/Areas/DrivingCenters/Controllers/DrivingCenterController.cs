using DriveHub.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DriveHub.Areas.DrivingCenters.Controllers;

[ApiController]
[Route("api/drivingcenters")]
[Authorize(Roles = "DrivingCenter")]
public class DrivingCenterController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DrivingCenterController(ApplicationDbContext context)
    {
        _context = context;
    }
}