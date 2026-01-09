namespace DriveHub.Areas.DrivingCenters.Models;

public class Vehicle
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int DrivingCenterId { get; set; }
    public DrivingCenter DrivingCenter { get; set; }
}