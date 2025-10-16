using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Models.DTOs
{
	 public class TimeTableDto
	{
		public string? Cabinet { get; set; }
		public int NumberLecture { get; set; }
		public string? Subject { get; set; }
		public string Time { get; set; } = string.Empty;
		public string? Teacher { get; set; }

		public string TextColumn()
		{
			if (string.IsNullOrEmpty(Subject))
				return "";

			var result = Subject;
			if (!string.IsNullOrEmpty(Teacher))
				result += $"\n{Teacher}";

			return result;
		}
	}

	public class TheadInformationDto
	{
		public List<DirectoryTime> DirectoryTimes { get; set; } = new();
		public string GroupName { get; set; } = string.Empty;
		public string Kab { get; set; } = string.Empty;
		public List<TimeTableDto> TimeTable { get; set; } = new();
	}

	public class GroupInformationDto
	{
		public List<string> Group { get; set; } = new();
	}
}
