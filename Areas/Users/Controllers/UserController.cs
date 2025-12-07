using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DriveHub.Areas.Users.DTOs;
using DriveHub.Areas.Users.Models;
using DriveHub.Data;
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

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserEmail),
            new Claim("role", user.UserRole),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _config["Jwt: Issuer"],
            audience: _config["Jwt: Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public UserController(ApplicationDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.UserEmail == dto.UserEmail))
            return BadRequest("Email is already registered");
        var user = new User
        {
            UserName = dto.UserName,
            UserEmail = dto.UserEmail,
            UserPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.UserPassword),
            UserRole = "User"
        };
        
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        
        return Ok("Registered Successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserEmail == dto.UserEmail);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.UserPassword, user.UserPasswordHash))
            return Unauthorized("Invalid Credentials");
        
        // this generated JWT token
        var token = GenerateJwtToken(user);
        return Ok(new
        {
            Token = token, 
            Name = user.UserName, 
            Email = user.UserEmail,
            Role = user.UserRole
        });
    }
}