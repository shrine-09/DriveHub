using System.Collections.Generic;

namespace DriveHub.Models;

public class DrivingCenter
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string CompanyName { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string CompanyEmail { get; set; } = string.Empty;
    public string CompanyContact { get; set; } = string.Empty;
    public string CompanyType { get; set; } = string.Empty;
    public bool IsVerified { get; set; } = false;

    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}