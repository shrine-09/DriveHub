namespace DriveHub.Models;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserPasswordHash { get; set; } = string.Empty;
    public string UserRole { get; set; } = "User";
    
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public bool MustChangePassword { get; set; } = false;
    
    public ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();
    public DrivingCenter? DrivingCenter { get; set; }
}
