using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "doctor_availabilities",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DoctorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    SlotDurationMinutes = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_availabilities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "doctor_availability_slots",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AvailabilityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    IsBooked = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    AppointmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_availability_slots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_doctor_availability_slots_doctor_availabilities_AvailabilityId",
                        column: x => x.AvailabilityId,
                        principalSchema: "hospital_management",
                        principalTable: "doctor_availabilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_doctor_availabilities_DoctorUserId_Date",
                schema: "hospital_management",
                table: "doctor_availabilities",
                columns: new[] { "DoctorUserId", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_doctor_availability_slots_AppointmentId",
                schema: "hospital_management",
                table: "doctor_availability_slots",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_availability_slots_AvailabilityId",
                schema: "hospital_management",
                table: "doctor_availability_slots",
                column: "AvailabilityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "doctor_availability_slots",
                schema: "hospital_management");

            migrationBuilder.DropTable(
                name: "doctor_availabilities",
                schema: "hospital_management");
        }
    }
}
