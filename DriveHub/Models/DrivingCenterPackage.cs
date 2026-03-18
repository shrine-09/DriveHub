namespace DriveHub.Models;

public class DrivingCenterPackage
{
    public int Id { get; set; }

    public int DrivingCenterId { get; set; }
    public DrivingCenter DrivingCenter { get; set; } = null!;

    public string ServiceType { get; set; } = string.Empty;   // Bike, Scooter, Car
    public string DurationType { get; set; } = string.Empty;  // 2Weeks, 1Month
    public decimal PriceNpr { get; set; }
}