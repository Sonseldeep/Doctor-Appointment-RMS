using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLabReportsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LabReports",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LabName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PanelName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ObservationDateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabReports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LabObservation",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LabReportId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReferenceRange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAbnormal = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabObservation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LabObservation_LabReports_LabReportId",
                        column: x => x.LabReportId,
                        principalSchema: "hospital_management",
                        principalTable: "LabReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LabObservation_LabReportId",
                schema: "hospital_management",
                table: "LabObservation",
                column: "LabReportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LabObservation",
                schema: "hospital_management");

            migrationBuilder.DropTable(
                name: "LabReports",
                schema: "hospital_management");
        }
    }
}
