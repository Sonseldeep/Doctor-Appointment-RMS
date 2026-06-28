using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHybridLabDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentType",
                schema: "hospital_management",
                table: "LabReports",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentUrl",
                schema: "hospital_management",
                table: "LabReports",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                schema: "hospital_management",
                table: "LabReports",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentType",
                schema: "hospital_management",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "DocumentUrl",
                schema: "hospital_management",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "MimeType",
                schema: "hospital_management",
                table: "LabReports");
        }
    }
}
