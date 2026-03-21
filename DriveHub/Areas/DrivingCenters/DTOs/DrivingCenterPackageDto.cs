using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterPackageDto
{
    [Required]
    public string ServiceType { get; set; } = string.Empty;   // Bike, Car

    [Required]
    public string DurationType { get; set; } = string.Empty;  // 2Weeks, 1Month

    [Range(1, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal PriceNpr { get; set; }
}