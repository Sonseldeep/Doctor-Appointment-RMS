using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoctorAppointmentSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorNmcNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NmcNumber",
                schema: "hospital_management",
                table: "doctor_profiles",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_profiles_NmcNumber",
                schema: "hospital_management",
                table: "doctor_profiles",
                column: "NmcNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_doctor_profiles_NmcNumber",
                schema: "hospital_management",
                table: "doctor_profiles");

            migrationBuilder.DropColumn(
                name: "NmcNumber",
                schema: "hospital_management",
                table: "doctor_profiles");
        }
    }
}
