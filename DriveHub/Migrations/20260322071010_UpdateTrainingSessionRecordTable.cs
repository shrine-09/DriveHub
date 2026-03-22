using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriveHub.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTrainingSessionRecordTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "TrainingSessionRecords");

            migrationBuilder.AddColumn<int>(
                name: "ConfidenceDisciplineRating",
                table: "TrainingSessionRecords",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TrafficAwarenessRating",
                table: "TrainingSessionRecords",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VehicleControlRating",
                table: "TrainingSessionRecords",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConfidenceDisciplineRating",
                table: "TrainingSessionRecords");

            migrationBuilder.DropColumn(
                name: "TrafficAwarenessRating",
                table: "TrainingSessionRecords");

            migrationBuilder.DropColumn(
                name: "VehicleControlRating",
                table: "TrainingSessionRecords");

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "TrainingSessionRecords",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
