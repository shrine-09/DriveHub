using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriveHub.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceDurationTypeWithDurationInDays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationType",
                table: "DrivingCenterPackages");

            migrationBuilder.DropColumn(
                name: "DurationType",
                table: "Bookings");

            migrationBuilder.AddColumn<int>(
                name: "DurationInDays",
                table: "DrivingCenterPackages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DurationInDays",
                table: "Bookings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationInDays",
                table: "DrivingCenterPackages");

            migrationBuilder.DropColumn(
                name: "DurationInDays",
                table: "Bookings");

            migrationBuilder.AddColumn<string>(
                name: "DurationType",
                table: "DrivingCenterPackages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DurationType",
                table: "Bookings",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
