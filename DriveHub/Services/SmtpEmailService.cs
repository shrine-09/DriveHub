using System.Net;
using System.Net.Mail;
using DriveHub.Models;
using Microsoft.Extensions.Options;

namespace DriveHub.Services;

public class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public SmtpEmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        message.To.Add(toEmail);

        using var client = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort)
        {
            Credentials = new NetworkCredential(
                _emailSettings.SmtpUser,
                _emailSettings.SmtpPass
            ),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }
}