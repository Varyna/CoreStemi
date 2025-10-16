using System.ComponentModel.DataAnnotations;

namespace Stemi.WebAPI.Features.Schedule.Queries.GetSchedule
{
	public class GetScheduleRequest
	{
		[Range(1, 10)]
		public int? Corpus { get; set; }

		public DateTime? Date { get; set; }

		public bool Next { get; set; } = false;
	}
}
