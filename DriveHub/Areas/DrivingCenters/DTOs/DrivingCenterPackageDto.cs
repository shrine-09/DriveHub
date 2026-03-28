using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterPackageDto
{
    [Required(ErrorMessage = "Please complete all service details or remove unnecessary service rows.")]
    public string ServiceType { get; set; } = string.Empty;

    [Range(1, 365, ErrorMessage = "Please enter a valid package duration in days.")]
    public int DurationInDays { get; set; }

    [Range(1, double.MaxValue, ErrorMessage = "Please enter a valid service price greater than 0.")]
    public decimal PriceNpr { get; set; }
}