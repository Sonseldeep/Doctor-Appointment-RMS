using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorRatings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "doctor_rating_summaries",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DoctorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalRatings = table.Column<int>(type: "int", nullable: false),
                    RatingSum = table.Column<int>(type: "int", nullable: false),
                    LastUpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_rating_summaries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "doctor_ratings",
                schema: "hospital_management",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DoctorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Stars = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_ratings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_doctor_rating_summaries_doctor_unique",
                schema: "hospital_management",
                table: "doctor_rating_summaries",
                column: "DoctorUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_doctor_ratings_doctor",
                schema: "hospital_management",
                table: "doctor_ratings",
                column: "DoctorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_ratings_patient_doctor_unique",
                schema: "hospital_management",
                table: "doctor_ratings",
                columns: new[] { "PatientUserId", "DoctorUserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "doctor_rating_summaries",
                schema: "hospital_management");

            migrationBuilder.DropTable(
                name: "doctor_ratings",
                schema: "hospital_management");
        }
    }
}
