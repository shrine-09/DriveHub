namespace DriveHub.Models;

public class Booking
{
    public int BookingId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int DrivingCenterId { get; set; }
    public DrivingCenter DrivingCenter { get; set; } = null!;

    public string ServiceType { get; set; } = string.Empty;   // Bike, Car
    public int DurationInDays { get; set; }
    public decimal PriceNpr { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string Status { get; set; } = "PendingStart"; // PendingStart, Active, Completed, Cancelled

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}