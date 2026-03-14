using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DriveHub.Areas.Users.DTOs;
using DriveHub.Data;
using DriveHub.Models;
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

    public UserController(ApplicationDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
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
                Convert.ToDouble(_config["Jwt:ExpireMinutes"])
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
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
            UserRole = "User"
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

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            name = user.UserName,
            email = user.UserEmail,
            role = user.UserRole
        });
    }
}