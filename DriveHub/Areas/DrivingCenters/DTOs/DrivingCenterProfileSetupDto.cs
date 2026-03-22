using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterProfileSetupDto
{
    [Required(ErrorMessage = "Address is required.")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "District is required.")]
    public string District { get; set; } = string.Empty;

    [Required(ErrorMessage = "Municipality is required.")]
    public string Municipality { get; set; } = string.Empty;

    [Required(ErrorMessage = "Latitude is required.")]
    public decimal? Latitude { get; set; }

    [Required(ErrorMessage = "Longitude is required.")]
    public decimal? Longitude { get; set; }

    public string? Description { get; set; }

    [MinLength(1, ErrorMessage = "Please add at least one service package.")]
    public List<DrivingCenterPackageDto> Packages { get; set; } = new();
}