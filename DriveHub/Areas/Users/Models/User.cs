namespace DriveHub.Areas.Users.Models;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string UserEmail { get; set; }
    public string UserPasswordHash { get; set; }
    public string UserRole { get; set; } = "User";
}

