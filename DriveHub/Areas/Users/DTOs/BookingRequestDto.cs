using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class BookingRequestDto
{
    [Required]
    public int DrivingCenterId { get; set; }

    [Required]
    public string ServiceType { get; set; } = string.Empty;

    [Range(1, 365, ErrorMessage = "Please select a valid package duration.")]
    public int DurationInDays { get; set; }

    [Required]
    public DateTime StartDate { get; set; }
}