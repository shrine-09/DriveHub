using System.ComponentModel.DataAnnotations;

namespace DriveHub.Areas.DrivingCenters.DTOs;

public class ExtendLearnerDto
{
    [Range(1, 365, ErrorMessage = "Please enter a valid number of extra days.")]
    public int ExtraDays { get; set; }
}