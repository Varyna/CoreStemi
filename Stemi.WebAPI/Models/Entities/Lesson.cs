namespace Stemi.WebAPI.Models.Entities
{
	public class Lesson
	{
		public int Id { get; set; }
		public required string Subject { get; set; }
		public required string Teacher { get; set; }
		public int? Corpus {  get; set; }
		public int DirectoryGroupsId { get; set; }
		public required DirectoryGroups DirectoryGroup { get; set; }

		public int DirectoryTimeId { get; set; }
		public required DirectoryTime DirectoryTime { get; set; }

		public int NumberLecture { get; set; }
		public DateTime Date { get; set; }

		public int DirectoryCabinetsId { get; set; }
		public required DirectoryCabinets DirectoryCabinets { get; set; }
	}
}
