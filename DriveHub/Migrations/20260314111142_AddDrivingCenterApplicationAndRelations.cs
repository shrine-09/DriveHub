using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DriveHub.Migrations
{
    /// <inheritdoc />
    public partial class AddDrivingCenterApplicationAndRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "DrivingCenters",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DrivingCenterApplications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CompanyName = table.Column<string>(type: "text", nullable: false),
                    RegistrationNumber = table.Column<string>(type: "text", nullable: false),
                    CompanyEmail = table.Column<string>(type: "text", nullable: false),
                    CompanyContact = table.Column<string>(type: "text", nullable: false),
                    CompanyType = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    AdminRemarks = table.Column<string>(type: "text", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrivingCenterApplications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserEmail",
                table: "Users",
                column: "UserEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DrivingCenters_CompanyEmail",
                table: "DrivingCenters",
                column: "CompanyEmail");

            migrationBuilder.CreateIndex(
                name: "IX_DrivingCenters_UserId",
                table: "DrivingCenters",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DrivingCenterApplications_CompanyEmail",
                table: "DrivingCenterApplications",
                column: "CompanyEmail");

            migrationBuilder.AddForeignKey(
                name: "FK_DrivingCenters_Users_UserId",
                table: "DrivingCenters",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DrivingCenters_Users_UserId",
                table: "DrivingCenters");

            migrationBuilder.DropTable(
                name: "DrivingCenterApplications");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserEmail",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_DrivingCenters_CompanyEmail",
                table: "DrivingCenters");

            migrationBuilder.DropIndex(
                name: "IX_DrivingCenters_UserId",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DrivingCenters");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "UserEmail", "UserName", "UserPasswordHash", "UserRole" },
                values: new object[] { 1, "admin@site.com", "admin", "$2a$11$FBSF7CvnUPQkBmWMOcb/HONeJqInzvMjPMAiuxpJm6DlhelLJGh7O", "Admin" });
        }
    }
}
