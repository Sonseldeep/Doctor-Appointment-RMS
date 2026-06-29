using System;
using System.Threading;
using System.Threading.Tasks;
using DoctorAppointmentSystem.Application.Abstractions.Labs;
using DoctorAppointmentSystem.Domain.Labs;
using DoctorAppointmentSystem.Infrastructure.Database;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DoctorAppointmentSystem.Infrastructure.Repositories;

public sealed class MedicalRecordAccessLogRepository : IMedicalRecordAccessLogRepository
{
    private readonly ApplicationDbContext _dbContext;

    public MedicalRecordAccessLogRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(MedicalRecordAccessLog log, CancellationToken cancellationToken = default)
    {
        // Extract the database connection string directly from your DbContext configuration
        var connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

        const string sql = @"
            INSERT INTO [hospital_management].[medical_record_access_logs] 
                ([Id], [DoctorUserId], [PatientUserId], [ActionTaken], [IpAddress], [AccessedAtUtc])
            VALUES 
                (@Id, @DoctorUserId, @PatientUserId, @ActionTaken, @IpAddress, @AccessedAtUtc)";

        // Open a completely isolated, native ADO.NET database channel 
        // that is immune to EF Core state pollution and tracking rollbacks
        using var connection = new SqlConnection(connectionString);
        using var command = new SqlCommand(sql, connection);

        command.Parameters.AddWithValue("@Id", log.Id);
        command.Parameters.AddWithValue("@DoctorUserId", log.DoctorUserId);
        command.Parameters.AddWithValue("@PatientUserId", log.PatientUserId);
        command.Parameters.AddWithValue("@ActionTaken", log.ActionTaken);
        command.Parameters.AddWithValue("@IpAddress", log.IpAddress);
        command.Parameters.AddWithValue("@AccessedAtUtc", log.AccessedAtUtc);

        await connection.OpenAsync(cancellationToken);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }
}