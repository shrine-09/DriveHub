using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Users.DTOs;

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}