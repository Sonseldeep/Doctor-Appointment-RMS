using DoctorAppointmentSystem.Application.Abstractions.Appointments;
using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Domain.Ratings;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Ratings.SubmitRating;

internal sealed class SubmitRatingCommandHandler
    : ICommandHandler<SubmitRatingCommand, Guid>
{
    private readonly IRatingRepository _ratings;
    private readonly IRatingSummaryRepository _summaries;
    private readonly IAppointmentRepository _appointments;
    private readonly IUnitOfWork _uow;

    public SubmitRatingCommandHandler(
        IRatingRepository ratings,
        IRatingSummaryRepository summaries,
        IAppointmentRepository appointments,
        IUnitOfWork uow)
    {
        _ratings = ratings;
        _summaries = summaries;
        _appointments = appointments;
        _uow = uow;
    }

    public async Task<ErrorOr<Guid>> Handle(
        SubmitRatingCommand request,
        CancellationToken cancellationToken)
    {
        
        var hasCompletedAppointment = await _appointments.HasCompletedAppointmentAsync(
            request.PatientUserId,
            request.DoctorUserId,
            cancellationToken);

        if (!hasCompletedAppointment)
        {
            return RatingErrors.NoCompletedAppointment;
        }

        var existing = await _ratings.GetByPatientAndDoctorAsync(
            request.PatientUserId,
            request.DoctorUserId,
            cancellationToken);

        if (existing is not null)
        {
            return RatingErrors.AlreadyRated;
        }

        var rating = DoctorRating.Create(
            request.DoctorUserId,
            request.PatientUserId,
            request.Stars,
            request.Comment);

        await _ratings.AddAsync(rating, cancellationToken);

        var summary = await _summaries.GetByDoctorUserIdAsync(request.DoctorUserId, cancellationToken);
        if (summary is null)
        {
            summary = DoctorRatingSummary.CreateEmpty(request.DoctorUserId);
            await _summaries.AddAsync(summary, cancellationToken);
        }

        summary.AddRating(request.Stars);

        await _uow.SaveChangesAsync(cancellationToken);

        return rating.Id;
    }
}
