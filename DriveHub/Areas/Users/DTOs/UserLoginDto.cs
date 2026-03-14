using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class UserLoginDto
{
    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;

    [Required]
    public string UserPassword { get; set; } = string.Empty;
}