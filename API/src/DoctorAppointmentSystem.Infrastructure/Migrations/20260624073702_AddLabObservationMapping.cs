using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLabObservationMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LabObservation_LabReports_LabReportId",
                schema: "hospital_management",
                table: "LabObservation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LabObservation",
                schema: "hospital_management",
                table: "LabObservation");

            migrationBuilder.RenameTable(
                name: "LabObservation",
                schema: "hospital_management",
                newName: "LabObservations",
                newSchema: "hospital_management");

            migrationBuilder.RenameIndex(
                name: "IX_LabObservation_LabReportId",
                schema: "hospital_management",
                table: "LabObservations",
                newName: "IX_LabObservations_LabReportId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LabObservations",
                schema: "hospital_management",
                table: "LabObservations",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LabObservations_LabReports_LabReportId",
                schema: "hospital_management",
                table: "LabObservations",
                column: "LabReportId",
                principalSchema: "hospital_management",
                principalTable: "LabReports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LabObservations_LabReports_LabReportId",
                schema: "hospital_management",
                table: "LabObservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LabObservations",
                schema: "hospital_management",
                table: "LabObservations");

            migrationBuilder.RenameTable(
                name: "LabObservations",
                schema: "hospital_management",
                newName: "LabObservation",
                newSchema: "hospital_management");

            migrationBuilder.RenameIndex(
                name: "IX_LabObservations_LabReportId",
                schema: "hospital_management",
                table: "LabObservation",
                newName: "IX_LabObservation_LabReportId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LabObservation",
                schema: "hospital_management",
                table: "LabObservation",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LabObservation_LabReports_LabReportId",
                schema: "hospital_management",
                table: "LabObservation",
                column: "LabReportId",
                principalSchema: "hospital_management",
                principalTable: "LabReports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
