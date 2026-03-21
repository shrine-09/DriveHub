using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterProfileSetupDto
{
    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    public string District { get; set; } = string.Empty;

    [Required]
    public string Municipality { get; set; } = string.Empty;

    [Required]
    public decimal? Latitude { get; set; }

    [Required]
    public decimal? Longitude { get; set; }

    public string? Description { get; set; }

    [MinLength(1, ErrorMessage = "At least one service package is required.")]
    public List<DrivingCenterPackageDto> Packages { get; set; } = new();
}