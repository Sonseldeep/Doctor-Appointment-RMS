using System.Globalization;
using Bogus;
using DoctorAppointmentSystem.Application.Abstractions.Authentication;
using DoctorAppointmentSystem.Domain.Appointments;
using DoctorAppointmentSystem.Domain.Doctor;
using DoctorAppointmentSystem.Domain.Labs;
using DoctorAppointmentSystem.Domain.Patients;
using DoctorAppointmentSystem.Domain.Users;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Api.Extensions;


public static class DemoDataSeedExtensions
{
    private const string DemoPassword = "Demo@12345";
    private const int BulkDoctorCount = 6;
    private const int BulkPatientCount = 25;

    public static async Task SeedDemoDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        var alreadySeeded = await db.Users.AnyAsync(u => u.Email == "sarah.connor@demo.com");
        if (alreadySeeded)
        {
            app.Logger.LogInformation("Demo data already present — skipping demo seed.");
            return;
        }

        Randomizer.Seed = new Random(20260701);
        var faker = new Faker("en");

        var passwordHash = hasher.Hash(DemoPassword);

   
        var docUser1 = CreateVerifiedUser("Sarah", "Connor", "sarah.connor@demo.com", passwordHash, UserRole.Doctor);
        var docUser2 = CreateVerifiedUser("Rajesh", "Sharma", "rajesh.sharma@demo.com", passwordHash, UserRole.Doctor);

        var doctor1 = DoctorProfile.Create(docUser1.Id, "10001", "15+ years in cardiology.", Specialization.Cardiologist, 1500m);
        var doctor2 = DoctorProfile.Create(docUser2.Id, "10002", "General physician, family medicine.", Specialization.General, 800m);
        doctor1.Activate();
        doctor2.Activate();

        var patUser1 = CreateVerifiedUser("John", "Miller", "john.miller@demo.com", passwordHash, UserRole.Registered);
        var patient1 = PatientProfile.Create(patUser1.Id);
        patient1.Update("9800000001", "Kathmandu, Nepal", Sex.Male, new DateOnly(1985, 3, 14));

        await db.Users.AddRangeAsync(docUser1, docUser2, patUser1);
        await db.DoctorProfiles.AddRangeAsync(doctor1, doctor2);
        await db.PatientProfiles.AddRangeAsync(patient1);
        await db.SaveChangesAsync();

        var now = DateTimeOffset.UtcNow;

        var apptAllowed = Appointment.Create(patUser1.Id, docUser1.Id, now.AddDays(-10), now.AddDays(-10).AddMinutes(30), "Chest pain follow-up");
        apptAllowed.Confirm(now.AddDays(-11));
        apptAllowed.Complete(now.AddDays(-10));

        var apptDenied = Appointment.Create(patUser1.Id, docUser2.Id, now.AddDays(-5), now.AddDays(-5).AddMinutes(30), "Second opinion");
        apptDenied.Cancel(now.AddDays(-6));

        await db.Appointments.AddRangeAsync(apptAllowed, apptDenied);
        await db.SaveChangesAsync();

        var anchorReport = LabReport.Create(patUser1.Id, "Kathmandu Central Lab", "Lipid Panel", DateTime.UtcNow.AddDays(-9));
        anchorReport.AddObservation("Total Cholesterol", "210", "mg/dL", "125-200", isAbnormal: true);
        anchorReport.AddObservation("HDL", "45", "mg/dL", "40-60", isAbnormal: false);
        anchorReport.AddObservation("LDL", "140", "mg/dL", "<130", isAbnormal: true);

        await db.LabReports.AddAsync(anchorReport);
        await db.SaveChangesAsync();


        var bulkDoctors = new List<(User User, DoctorProfile Profile)>();
        for (var i = 0; i < BulkDoctorCount; i++)
        {
            var firstName = faker.Name.FirstName();
            var lastName = faker.Name.LastName();
            var email = $"{firstName}.{lastName}.{i}@demo.bogus".ToLowerInvariant();

            var user = CreateVerifiedUser(firstName, lastName, email, passwordHash, UserRole.Doctor);
            var profile = DoctorProfile.Create(
                user.Id,
                $"{faker.Random.Number(20000, 99999)}",
                faker.Lorem.Sentence(10),
                faker.PickRandom<Specialization>(),
                faker.Random.Decimal(500m, 2500m));

            profile.Activate();
            bulkDoctors.Add((user, profile));
        }

        var bulkPatients = new List<(User User, PatientProfile Profile)>();
        for (var i = 0; i < BulkPatientCount; i++)
        {
            var firstName = faker.Name.FirstName();
            var lastName = faker.Name.LastName();
            var email = $"{firstName}.{lastName}.{i}@demo.bogus".ToLowerInvariant();

            var user = CreateVerifiedUser(firstName, lastName, email, passwordHash, UserRole.Registered);
            var profile = PatientProfile.Create(user.Id);
            var dob = DateOnly.FromDateTime(faker.Date.Past(50, DateTime.UtcNow.AddYears(-18)));
            profile.Update(faker.Phone.PhoneNumber("98########"), $"{faker.Address.City()}, Nepal", faker.PickRandom<Sex>(), dob);

            bulkPatients.Add((user, profile));
        }

        await db.Users.AddRangeAsync(bulkDoctors.Select(d => d.User).Concat(bulkPatients.Select(p => p.User)));
        await db.DoctorProfiles.AddRangeAsync(bulkDoctors.Select(d => d.Profile));
        await db.PatientProfiles.AddRangeAsync(bulkPatients.Select(p => p.Profile));
        await db.SaveChangesAsync();

        var bulkAppointments = new List<Appointment>();
        foreach (var (patientUser, _) in bulkPatients)
        {
            var doctorsForThisPatient = faker.PickRandom(bulkDoctors, faker.Random.Int(0, 3)).ToList();

            foreach (var (doctorUser, _) in doctorsForThisPatient)
            {
                var isPast = faker.Random.Bool(0.6f);
                var start = isPast
                    ? now.AddDays(-faker.Random.Int(1, 90))
                    : now.AddDays(faker.Random.Int(1, 30));

                var appt = Appointment.Create(patientUser.Id, doctorUser.Id, start, start.AddMinutes(30), faker.Lorem.Sentence(6));

                if (isPast)
                {
                    if (faker.Random.Bool(0.75f))
                    {
                        appt.Confirm(start.AddDays(-1));
                        appt.Complete(start.AddMinutes(30));
                    }
                    else
                    {
                        appt.Cancel(start.AddDays(-1));
                    }
                }
                else
                {
                    var roll = faker.Random.Float();
                    if (roll < 0.5f)
                    {
                        appt.Confirm(now.AddDays(-1));
                    }
                    else if (roll < 0.85f)
                    {
                    }
                    else
                    {
                        appt.Cancel(now.AddDays(-1));
                    }
                }

                bulkAppointments.Add(appt);
            }
        }

        await db.Appointments.AddRangeAsync(bulkAppointments);
        await db.SaveChangesAsync();

        var testPool = new (string Name, string Unit, double Low, double High)[]
        {
            ("Hemoglobin", "g/dL", 12.0, 17.0),
            ("WBC", "10^3/uL", 4.0, 11.0),
            ("Total Cholesterol", "mg/dL", 125.0, 200.0),
            ("HDL", "mg/dL", 40.0, 60.0),
            ("LDL", "mg/dL", 60.0, 130.0),
            ("Fasting Glucose", "mg/dL", 70.0, 100.0),
            ("Creatinine", "mg/dL", 0.6, 1.3),
            ("TSH", "uIU/mL", 0.4, 4.0),
        };

        var labNames = new[] { "Kathmandu Central Lab", "Norvic Diagnostics", "Grande Hospital Lab", "B&B Lab Services" };
        var panelNames = new[] { "Lipid Panel", "Complete Blood Count", "Metabolic Panel", "Thyroid Panel" };

        var bulkReports = new List<LabReport>();
        foreach (var appt in bulkAppointments.Where(a => a.Status == AppointmentStatus.Completed))
        {
            if (!faker.Random.Bool(0.7f))
            {
                continue;
            }

            var report = LabReport.Create(
                appt.PatientUserId,
                faker.PickRandom(labNames),
                faker.PickRandom(panelNames),
                appt.CompletedAtUtc!.Value.UtcDateTime);

            foreach (var test in faker.PickRandom(testPool, faker.Random.Int(2, 4)))
            {
                var isAbnormal = faker.Random.Bool(0.25f);
                var value = isAbnormal
                    ? Math.Round(test.High * faker.Random.Double(1.1, 1.4), 1)
                    : Math.Round(faker.Random.Double(test.Low, test.High), 1);

                report.AddObservation(
                    test.Name,
                    value.ToString(CultureInfo.InvariantCulture),
                    test.Unit,
                    $"{test.Low}-{test.High}",
                    isAbnormal);
            }

            bulkReports.Add(report);
        }

        await db.LabReports.AddRangeAsync(bulkReports);
        await db.SaveChangesAsync();

        app.Logger.LogInformation(
            "Seeded demo dataset: 2 anchor doctors, 1 anchor patient, {BulkDoctors} bulk doctors, {BulkPatients} bulk patients, " +
            "{Appointments} appointments, {Reports} lab reports. Shared password for all demo accounts: {Password}",
            BulkDoctorCount,
            BulkPatientCount,
            bulkAppointments.Count + 2,
            bulkReports.Count + 1,
            DemoPassword);
    }

    private static User CreateVerifiedUser(string firstName, string lastName, string email, string passwordHash, UserRole role)
    {
        var user = User.Create(firstName, lastName, email, passwordHash, role);
        user.VerifyEmail();
        return user;
    }
}