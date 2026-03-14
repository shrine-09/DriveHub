using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class DrivingCenterSubmitDto
{
    [Required]
    [EmailAddress]
    public string CompanyEmail { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d+$", ErrorMessage = "Contact number must contain digits only.")]
    public string CompanyContact { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d+$", ErrorMessage = "Registration number must contain digits only.")]
    public string RegistrationNumber { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^(public|private|nonprofit)$", ErrorMessage = "Invalid company type.")]
    public string CompanyType { get; set; } = string.Empty;
}