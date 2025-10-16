using Stemi.WebAPI.Models.DTOs;
using System.Data;

namespace Stemi.WebAPI.Features.Schedule.Queries.GetSchedule
{
	public class ScheduleResponse
	{
		public List<DataTable> Tables { get; set; } = new();
		public List<GroupInformationDto> GroupInformations { get; set; } = new();
		public DateTime Date { get; set; }
		public int Corpus { get; set; }
	}
}
