using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpPurposeAndRateLimits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_otps_users_UserId",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.DropIndex(
                name: "IX_user_otps_UserId",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                schema: "hospital_management",
                table: "user_otps",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<int>(
                name: "FailedAttempts",
                schema: "hospital_management",
                table: "user_otps",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "InvalidatedAt",
                schema: "hospital_management",
                table: "user_otps",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Purpose",
                schema: "hospital_management",
                table: "user_otps",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "otp_request_limits",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    Purpose = table.Column<int>(type: "int", nullable: false),
                    WindowStartUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RequestCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_otp_request_limits", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_otps_UserId_Purpose",
                schema: "hospital_management",
                table: "user_otps",
                columns: new[] { "UserId", "Purpose" });

            migrationBuilder.CreateIndex(
                name: "IX_otp_request_limits_Email_Purpose",
                schema: "hospital_management",
                table: "otp_request_limits",
                columns: new[] { "Email", "Purpose" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "otp_request_limits",
                schema: "hospital_management");

            migrationBuilder.DropIndex(
                name: "IX_user_otps_UserId_Purpose",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.DropColumn(
                name: "FailedAttempts",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.DropColumn(
                name: "InvalidatedAt",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.DropColumn(
                name: "Purpose",
                schema: "hospital_management",
                table: "user_otps");

            migrationBuilder.CreateIndex(
                name: "IX_user_otps_UserId",
                schema: "hospital_management",
                table: "user_otps",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_user_otps_users_UserId",
                schema: "hospital_management",
                table: "user_otps",
                column: "UserId",
                principalSchema: "hospital_management",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
