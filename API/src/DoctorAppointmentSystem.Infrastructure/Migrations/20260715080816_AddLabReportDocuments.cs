using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLabReportDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "LabReportDocuments",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LabReportId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MimeType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    UploadedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabReportDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LabReportDocuments_LabReports_LabReportId",
                        column: x => x.LabReportId,
                        principalSchema: "hospital_management",
                        principalTable: "LabReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LabReportDocuments_LabReportId",
                schema: "hospital_management",
                table: "LabReportDocuments",
                column: "LabReportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LabReportDocuments",
                schema: "hospital_management");

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
    }
}
