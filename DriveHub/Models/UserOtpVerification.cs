using System.ComponentModel.DataAnnotations;

namespace DriveHub.Models;

public class UserOtpVerification
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public string OtpCodeHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}