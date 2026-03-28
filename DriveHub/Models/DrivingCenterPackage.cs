namespace DriveHub.Models;

public class DrivingCenterPackage
{
    public int Id { get; set; }

    public int DrivingCenterId { get; set; }
    public DrivingCenter DrivingCenter { get; set; } = null!;

    public string ServiceType { get; set; } = string.Empty;   // Bike, Scooter, Car
    public int DurationInDays { get; set; }
    public decimal PriceNpr { get; set; }
}