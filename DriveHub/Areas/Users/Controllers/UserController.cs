using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DriveHub.Areas.Users.DTOs;
using DriveHub.Data;
using DriveHub.Models;
using DriveHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DriveHub.Areas.Users.Controllers;

[ApiController]
[Route("api/users/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;

    public UserController(ApplicationDbContext db, IConfiguration config, IEmailService emailService)
    {
        _db = db;
        _config = config;
        _emailService = emailService;
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Role, user.UserRole),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.UserEmail)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_config["Jwt:DurationInMinutes"])
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateSecureRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }

    private static string HashTokenValue(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/"
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    private void ClearRefreshTokenCookie()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(-1),
            Path = "/"
        };

        Response.Cookies.Append("refreshToken", "", cookieOptions);
    }

    private static string GenerateSixDigitOtp()
    {
        return RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
    }

    private static string HashOtp(string otpCode)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(otpCode));
        return Convert.ToHexString(bytes);
    }

    private async Task SendOtpEmailAsync(User user, string otpCode)
    {
        var emailBody = $@"
            <h2>DriveHub Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style='letter-spacing: 4px;'>{otpCode}</h1>
            <p>This code will expire in 10 minutes.</p>
        ";

        await _emailService.SendEmailAsync(
            user.UserEmail,
            "DriveHub Verification Code",
            emailBody
        );
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        var email = dto.UserEmail.Trim().ToLower();

        var exists = await _db.Users.AnyAsync(u => u.UserEmail.ToLower() == email);
        if (exists)
            return BadRequest(new { message = "Email is already registered." });

        var user = new User
        {
            UserName = dto.UserName.Trim(),
            UserEmail = email,
            UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.UserPassword),
            UserRole = "User",
            IsVerified = false
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Registered successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var email = dto.UserEmail.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserEmail.ToLower() == email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.UserPassword, user.UserPasswordHash))
            return Unauthorized(new { message = "Invalid credentials." });

        if (user.UserRole == "User" && !user.IsVerified)
        {
            var existingOtps = await _db.UserOtpVerifications
                .Where(o => o.UserId == user.UserId && !o.IsUsed)
                .ToListAsync();

            if (existingOtps.Count > 0)
            {
                _db.UserOtpVerifications.RemoveRange(existingOtps);
            }

            var otpCode = GenerateSixDigitOtp();

            var otpEntry = new UserOtpVerification
            {
                UserId = user.UserId,
                OtpCodeHash = HashOtp(otpCode),
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };

            _db.UserOtpVerifications.Add(otpEntry);
            await _db.SaveChangesAsync();

            await SendOtpEmailAsync(user, otpCode);

            return Ok(new
            {
                requiresOtpVerification = true,
                email = user.UserEmail,
                message = "A verification code has been sent to your email."
            });
        }

        var accessToken = GenerateJwtToken(user);

        var rawRefreshToken = GenerateSecureRefreshToken();
        var refreshToken = new RefreshToken
        {
            UserId = user.UserId,
            TokenHash = HashTokenValue(rawRefreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            RevokedAt = null
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();

        SetRefreshTokenCookie(rawRefreshToken);

        bool isProfileComplete = true;

        if (user.UserRole == "DrivingCenter")
        {
            var center = await _db.DrivingCenters
                .FirstOrDefaultAsync(dc => dc.UserId == user.UserId);

            isProfileComplete = center?.IsProfileComplete ?? false;
        }

        return Ok(new
        {
            token = accessToken,
            name = user.UserName,
            email = user.UserEmail,
            role = user.UserRole,
            mustChangePassword = user.MustChangePassword,
            isProfileComplete = isProfileComplete
        });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var email = dto.UserEmail.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserEmail.ToLower() == email);

        if (user == null)
            return NotFound(new { message = "User not found." });

        var otpEntry = await _db.UserOtpVerifications
            .Where(o =>
                o.UserId == user.UserId &&
                !o.IsUsed &&
                o.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otpEntry == null)
            return BadRequest(new { message = "OTP is invalid or expired." });

        var hashedOtp = HashOtp(dto.OtpCode.Trim());

        if (otpEntry.OtpCodeHash != hashedOtp)
            return BadRequest(new { message = "Incorrect OTP code." });

        otpEntry.IsUsed = true;
        user.IsVerified = true;

        var accessToken = GenerateJwtToken(user);

        var rawRefreshToken = GenerateSecureRefreshToken();
        var refreshToken = new RefreshToken
        {
            UserId = user.UserId,
            TokenHash = HashTokenValue(rawRefreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            RevokedAt = null
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();

        SetRefreshTokenCookie(rawRefreshToken);

        return Ok(new
        {
            token = accessToken,
            name = user.UserName,
            email = user.UserEmail,
            role = user.UserRole,
            mustChangePassword = user.MustChangePassword,
            isProfileComplete = true
        });
    }

    [HttpPost("resend-otp")]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtpDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var email = dto.UserEmail.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserEmail.ToLower() == email);

        if (user == null)
            return NotFound(new { message = "User not found." });

        if (user.IsVerified)
            return BadRequest(new { message = "User is already verified." });

        var existingOtps = await _db.UserOtpVerifications
            .Where(o => o.UserId == user.UserId && !o.IsUsed)
            .ToListAsync();

        if (existingOtps.Count > 0)
        {
            _db.UserOtpVerifications.RemoveRange(existingOtps);
        }

        var otpCode = GenerateSixDigitOtp();

        var otpEntry = new UserOtpVerification
        {
            UserId = user.UserId,
            OtpCodeHash = HashOtp(otpCode),
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsUsed = false
        };

        _db.UserOtpVerifications.Add(otpEntry);
        await _db.SaveChangesAsync();

        await SendOtpEmailAsync(user, otpCode);

        return Ok(new { message = "A new verification code has been sent." });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmNewPassword)
            return BadRequest(new { message = "New passwords do not match." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            return NotFound(new { message = "User not found." });

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.UserPasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.UserPasswordHash))
            return BadRequest(new { message = "New password must be different from current password." });

        user.UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.MustChangePassword = false;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully." });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var email = dto.UserEmail.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserEmail.ToLower() == email);

        if (user != null)
        {
            var rawToken = GenerateSecureToken();
            var tokenHash = HashToken(rawToken);

            var resetToken = new PasswordResetToken
            {
                UserId = user.UserId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            _db.PasswordResetTokens.Add(resetToken);
            await _db.SaveChangesAsync();

            var resetLink = $"http://localhost:5173/reset-password?token={Uri.EscapeDataString(rawToken)}";

            var emailBody = $@"
            <h2>DriveHub Password Reset</h2>
            <p>You requested a password reset for your account.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href='{resetLink}'>Reset Password</a></p>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request this, you can ignore this email.</p>
        ";

            await _emailService.SendEmailAsync(
                user.UserEmail,
                "DriveHub Password Reset",
                emailBody
            );
        }

        return Ok(new
        {
            message = "If an account with that email exists, a password reset link has been sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmNewPassword)
            return BadRequest(new { message = "Passwords do not match." });

        var tokenHash = HashToken(dto.Token);

        var resetToken = await _db.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t =>
                t.TokenHash == tokenHash &&
                !t.IsUsed &&
                t.ExpiresAt > DateTime.UtcNow);

        if (resetToken == null)
            return BadRequest(new { message = "Invalid or expired reset token." });

        resetToken.User.UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        resetToken.User.MustChangePassword = false;
        resetToken.IsUsed = true;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Password reset successfully." });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var rawRefreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrWhiteSpace(rawRefreshToken))
            return Unauthorized(new { message = "Refresh token cookie is missing." });

        var tokenHash = HashTokenValue(rawRefreshToken);

        var existingToken = await _db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt =>
                rt.TokenHash == tokenHash &&
                rt.RevokedAt == null &&
                rt.ExpiresAt > DateTime.UtcNow);

        if (existingToken == null)
            return Unauthorized(new { message = "Invalid or expired refresh token." });

        var nowUtc = DateTime.UtcNow;

        existingToken.RevokedAt = nowUtc;

        var newAccessToken = GenerateJwtToken(existingToken.User);
        var newRawRefreshToken = GenerateSecureRefreshToken();

        var newRefreshToken = new RefreshToken
        {
            UserId = existingToken.UserId,
            TokenHash = HashTokenValue(newRawRefreshToken),
            CreatedAt = nowUtc,
            ExpiresAt = nowUtc.AddDays(7),
            RevokedAt = null
        };

        _db.RefreshTokens.Add(newRefreshToken);
        await _db.SaveChangesAsync();

        SetRefreshTokenCookie(newRawRefreshToken);

        return Ok(new
        {
            token = newAccessToken,
            name = existingToken.User.UserName,
            email = existingToken.User.UserEmail,
            role = existingToken.User.UserRole,
            mustChangePassword = existingToken.User.MustChangePassword
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var rawRefreshToken = Request.Cookies["refreshToken"];

        if (!string.IsNullOrWhiteSpace(rawRefreshToken))
        {
            var tokenHash = HashTokenValue(rawRefreshToken);

            var existingToken = await _db.RefreshTokens
                .FirstOrDefaultAsync(rt =>
                    rt.TokenHash == tokenHash &&
                    rt.RevokedAt == null);

            if (existingToken != null)
            {
                existingToken.RevokedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }

        ClearRefreshTokenCookie();

        return Ok(new { message = "Logged out successfully." });
    }

    [Authorize(Roles = "User")]
    [HttpPost("book-driving-center")]
    public async Task<IActionResult> BookDrivingCenter([FromBody] BookingRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var requestedDate = DateTime.SpecifyKind(dto.StartDate.Date, DateTimeKind.Utc);

        if (requestedDate < DateTime.UtcNow.Date)
            return BadRequest(new { message = "Start date cannot be in the past." });

        var allowedServices = new[] { "Bike", "Car" };

        if (!allowedServices.Contains(dto.ServiceType))
            return BadRequest(new { message = "Invalid service type selected." });

        var drivingCenter = await _db.DrivingCenters
            .Include(dc => dc.Packages)
            .FirstOrDefaultAsync(dc => dc.Id == dto.DrivingCenterId && dc.IsVerified);

        if (drivingCenter == null)
            return NotFound(new { message = "Driving center not found." });

        var selectedPackage = drivingCenter.Packages.FirstOrDefault(p =>
            p.ServiceType == dto.ServiceType &&
            p.DurationInDays == dto.DurationInDays);

        if (selectedPackage == null)
            return BadRequest(new { message = "Selected package is not offered by this driving center." });

        var startDateUtc = DateTime.SpecifyKind(dto.StartDate.Date, DateTimeKind.Utc);

        var endDateUtc = startDateUtc.AddDays(dto.DurationInDays);

        var booking = new Booking
        {
            UserId = userId,
            DrivingCenterId = drivingCenter.Id,
            ServiceType = dto.ServiceType,
            DurationInDays = dto.DurationInDays,
            PriceNpr = selectedPackage.PriceNpr,
            StartDate = startDateUtc,
            EndDate = endDateUtc,
            Status = "PendingStart"
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Booking request submitted successfully.",
            booking.BookingId,
            booking.Status
        });
    }

    [Authorize(Roles = "User")]
    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var bookings = await _db.Bookings
            .Include(b => b.DrivingCenter)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new
            {
                b.BookingId,
                b.ServiceType,
                b.DurationInDays,
                b.PriceNpr,
                b.StartDate,
                b.EndDate,
                b.Status,
                b.CreatedAt,
                drivingCenter = new
                {
                    b.DrivingCenter.Id,
                    b.DrivingCenter.CompanyName,
                    b.DrivingCenter.CompanyContact,
                    b.DrivingCenter.CompanyEmail,
                    b.DrivingCenter.Address,
                    b.DrivingCenter.District,
                    b.DrivingCenter.Municipality
                }
            })
            .ToListAsync();

        return Ok(bookings);
    }
}