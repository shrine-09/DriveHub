using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$",
        ErrorMessage = "Password must contain uppercase, lowercase, number, and special character.")]
    public string NewPassword { get; set; } = string.Empty;

    [Required]
    public string ConfirmNewPassword { get; set; } = string.Empty;
}