namespace DriveHub.Models;

public class TrainingSessionRecord
{
    public int TrainingSessionRecordId { get; set; }

    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public DateTime Date { get; set; }

    public bool IsPresent { get; set; }

    public int? VehicleControlRating { get; set; }
    public int? TrafficAwarenessRating { get; set; }
    public int? ConfidenceDisciplineRating { get; set; }

    public string? Remarks { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}