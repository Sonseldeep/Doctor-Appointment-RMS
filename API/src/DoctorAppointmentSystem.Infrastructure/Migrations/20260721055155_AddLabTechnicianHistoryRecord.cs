using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLabTechnicianHistoryRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SentAtUtc",
                schema: "hospital_management",
                table: "LabReports",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "SentByLabTechnicianId",
                schema: "hospital_management",
                table: "LabReports",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_LabReports_SentByLabTechnicianId",
                schema: "hospital_management",
                table: "LabReports",
                column: "SentByLabTechnicianId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LabReports_SentByLabTechnicianId",
                schema: "hospital_management",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "SentAtUtc",
                schema: "hospital_management",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "SentByLabTechnicianId",
                schema: "hospital_management",
                table: "LabReports");
        }
    }
}
