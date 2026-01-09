using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriveHub.Migrations
{
    /// <inheritdoc />
    public partial class midupdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "UserPasswordHash",
                value: "$2a$11$FBSF7CvnUPQkBmWMOcb/HONeJqInzvMjPMAiuxpJm6DlhelLJGh7O");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "UserPasswordHash",
                value: "$2a$11$qVDlD9ar8VFW2mFgIrpnJek.ggzjwbe.wDPmLS/PCaHponTHOFmpy");
        }
    }
}
