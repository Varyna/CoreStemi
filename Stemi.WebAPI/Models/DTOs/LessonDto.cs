namespace Stemi.WebAPI.Models.DTOs
{
	public class LessonDto
	{
		public int Id { get; set; }
		public string Subject { get; set; }
		public string Teacher { get; set; }
		public int DirectoryGroupsId { get; set; }
		public string GroupName { get; set; }
		public int DirectoryTimeId { get; set; }
		public string TimeName { get; set; }
		public int NumberLecture { get; set; }
		public DateTime Date { get; set; }
		public int DirectoryCabinetsId { get; set; }
		public string CabinetName { get; set; }
	}
}
