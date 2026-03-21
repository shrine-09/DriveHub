namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterPackageDto
{
    public string ServiceType { get; set; } = string.Empty;   // Bike, Scooter, Car
    public string DurationType { get; set; } = string.Empty;  // 2Weeks, 1Month
    public decimal PriceNpr { get; set; }
}