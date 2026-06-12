using DoctorAppointmentSystem.Application.Abstractions.Messaging;
using DoctorAppointmentSystem.Application.Abstractions.Ratings;
using DoctorAppointmentSystem.Application.Features.Ratings.Contracts;
using ErrorOr;

namespace DoctorAppointmentSystem.Application.Features.Ratings.GetDoctorRating;

internal sealed class GetDoctorRatingsQueryHandler
    : IQueryHandler<GetDoctorRatingsQuery, GetDoctorRatingsResponse>
{
    private readonly IRatingRepository _ratings;
    private readonly IRatingSummaryRepository _summaries;

    public GetDoctorRatingsQueryHandler(
        IRatingRepository ratings,
        IRatingSummaryRepository summaries)
    {
        _ratings = ratings;
        _summaries = summaries;
    }

    public async Task<ErrorOr<GetDoctorRatingsResponse>> Handle(
        GetDoctorRatingsQuery request,
        CancellationToken cancellationToken)
    {
        var summary = await _summaries.GetByDoctorUserIdAsync(request.DoctorUserId, cancellationToken);
        
        var ratings = await _ratings.GetByDoctorAsync(request.DoctorUserId, cancellationToken);

        var summaryResponse = summary is not null
            ? new RatingSummaryResponse(summary.DoctorUserId, summary.AverageRating, summary.TotalRatings)
            : new RatingSummaryResponse(request.DoctorUserId, 0m, 0);

        var ratingResponses = ratings
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new RatingResponse(
                r.Id,
                r.DoctorUserId,
                r.PatientUserId,
                r.Stars,
                r.Comment,
                r.CreatedAtUtc,
                r.UpdatedAtUtc))
            .ToList()
            .AsReadOnly();

        return new GetDoctorRatingsResponse(summaryResponse, ratingResponses);
    }
}