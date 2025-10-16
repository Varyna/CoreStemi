using MediatR;

namespace Stemi.WebAPI.Features.Schedule.Queries.GetSchedule
{
	public record GetScheduleQuery(int? Corpus, DateTime? Date, bool Next = false)
	  : IRequest<ScheduleResponse>;
}