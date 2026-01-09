namespace DriveHub.Areas.DrivingCenters.Models;

public class DrivingCenter
{
    public int Id { get; set; }
    public string CompanyName { get; set; }
    public string RegistrationNumber { get; set; }
    public string CompanyEmail {get; set;}
    public string CompanyContact {get; set;}
    public ICollection<Vehicle> Vehicles { get; set; }
    public string CompanyType {get; set;}
    public bool IsVerifed { get; set; } = false;
}

