using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class BookingRequestDto
{
    [Required]
    public int DrivingCenterId { get; set; }

    [Required]
    public string ServiceType { get; set; } = string.Empty;   // Bike, Car

    [Required]
    public string DurationType { get; set; } = string.Empty;  // 2Weeks, 1Month

    [Required]
    public DateTime StartDate { get; set; }
}