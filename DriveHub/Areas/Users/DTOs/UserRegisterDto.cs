using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class UserRegisterDto
{
    [Required]
    [MinLength(2)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$",
        ErrorMessage = "Password must contain uppercase, lowercase, number, and special character.")]
    public string UserPassword { get; set; } = string.Empty;
}