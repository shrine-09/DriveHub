using DriveHub.Areas.Users.Models;

namespace DriveHub.Areas.DrivingCenters.Models;

public class DrivingCenter
{
    
    public int Id { get; set; }
    public int UserId { get; set; }   // foreign key to Users table
    public User User { get; set; }
    
    
    public string CompanyName { get; set; }
    public string RegistrationNumber { get; set; }
    public string CompanyEmail {get; set;}
    public string CompanyContact {get; set;}
    public ICollection<Vehicle> Vehicles { get; set; }
    public string CompanyType {get; set;}
    public bool IsVerified { get; set; } = false;
}

