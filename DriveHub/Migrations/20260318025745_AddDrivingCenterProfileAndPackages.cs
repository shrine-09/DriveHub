using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DriveHub.Migrations
{
    /// <inheritdoc />
    public partial class AddDrivingCenterProfileAndPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "DrivingCenters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "DrivingCenters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "DrivingCenters",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProfileComplete",
                table: "DrivingCenters",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "DrivingCenters",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "DrivingCenters",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Municipality",
                table: "DrivingCenters",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DrivingCenterPackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DrivingCenterId = table.Column<int>(type: "integer", nullable: false),
                    ServiceType = table.Column<string>(type: "text", nullable: false),
                    DurationType = table.Column<string>(type: "text", nullable: false),
                    PriceNpr = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrivingCenterPackages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrivingCenterPackages_DrivingCenters_DrivingCenterId",
                        column: x => x.DrivingCenterId,
                        principalTable: "DrivingCenters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrivingCenterPackages_DrivingCenterId",
                table: "DrivingCenterPackages",
                column: "DrivingCenterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrivingCenterPackages");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "District",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "IsProfileComplete",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "DrivingCenters");

            migrationBuilder.DropColumn(
                name: "Municipality",
                table: "DrivingCenters");
        }
    }
}
