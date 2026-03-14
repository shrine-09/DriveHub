using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriveHub.Migrations
{
    /// <inheritdoc />
    public partial class RenameIsVerifedToIsVerified : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsVerifed",
                table: "DrivingCenters",
                newName: "IsVerified");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsVerified",
                table: "DrivingCenters",
                newName: "IsVerifed");
        }
    }
}
