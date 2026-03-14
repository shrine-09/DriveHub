namespace DriveHub.Models;

public class DrivingCenterApplication
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string CompanyEmail { get; set; } = string.Empty;
    public string CompanyContact { get; set; } = string.Empty;
    public string CompanyType { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public string? AdminRemarks { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
}