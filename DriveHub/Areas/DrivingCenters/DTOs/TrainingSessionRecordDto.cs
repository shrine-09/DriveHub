using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class TrainingSessionRecordDto
{
    [Required]
    public int BookingId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public bool IsPresent { get; set; }

    [Range(1, 10, ErrorMessage = "Vehicle control rating must be between 1 and 10.")]
    public int? VehicleControlRating { get; set; }

    [Range(1, 10, ErrorMessage = "Traffic awareness rating must be between 1 and 10.")]
    public int? TrafficAwarenessRating { get; set; }

    [Range(1, 10, ErrorMessage = "Confidence and discipline rating must be between 1 and 10.")]
    public int? ConfidenceDisciplineRating { get; set; }

    public string? Remarks { get; set; }
}