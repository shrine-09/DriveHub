using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.Admin.DTOs;

public class RejectDrivingCenterApplicationDto
{
    [MaxLength(500)]
    public string? AdminRemarks { get; set; }
}