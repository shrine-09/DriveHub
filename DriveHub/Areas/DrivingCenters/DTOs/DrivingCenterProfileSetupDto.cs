using System.Collections.Generic;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterProfileSetupDto
{
    public string Address { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Municipality { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Description { get; set; }

    public List<DrivingCenterPackageDto> Packages { get; set; } = new();
}