using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class ResendOtpDto
{
    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;
}