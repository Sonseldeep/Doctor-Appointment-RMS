using DoctorAppointmentSystem.Application.Abstractions.Interfaces;
using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Domain.Ratings;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Ratings.UpdateRating;

internal sealed class UpdateRatingCommandHandler
    : ICommandHandler<UpdateRatingCommand>
{
    private readonly IRatingRepository _ratings;
    private readonly IRatingSummaryRepository _summaries;
    private readonly IUnitOfWork _uow;

    public UpdateRatingCommandHandler(
        IRatingRepository ratings,
        IRatingSummaryRepository summaries,
        IUnitOfWork uow)
    {
        _ratings = ratings;
        _summaries = summaries;
        _uow = uow;
    }

    public async Task<ErrorOr<Success>> Handle(
        UpdateRatingCommand request,
        CancellationToken cancellationToken)
    {
        var rating = await _ratings.GetByIdAsync(request.RatingId, cancellationToken);
        if (rating is null)
        {
            return RatingErrors.NotFound;
        }

        if (rating.PatientUserId != request.PatientUserId)
        {
            return RatingErrors.Forbidden;
        }

        var oldStars = rating.Update(request.Stars, request.Comment);

        var summary = await _summaries.GetByDoctorUserIdAsync(rating.DoctorUserId, cancellationToken);
        summary?.UpdateRating(oldStars, request.Stars);

        await _uow.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}