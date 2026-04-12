using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class VerifyOtpDto
{
    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string OtpCode { get; set; } = string.Empty;
}