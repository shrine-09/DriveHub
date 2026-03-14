namespace DriveHub.Models;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserPasswordHash { get; set; } = string.Empty;
    public string UserRole { get; set; } = "User";

    public DrivingCenter? DrivingCenter { get; set; }
}