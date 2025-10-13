namespace Stemi.WebAPI.Models.DTOs
{
	public class SessionDto
	{
		public int Id { get; set; }
		public string? ControlType { get; set; }
		public int? SessionCourse { get; set; }
		public string? SessionName { get; set; }
		public string? SessionYear { get; set; }
		public string? Subject { get; set; }
		public string? NameStudents { get; set; }
		public string? Score { get; set; }
		public int Relevance { get; set; }
		public Guid StudentsId { get; set; }
		public string? Group { get; set; }
		public DateTime CreatedAt { get; set; }
	}
}
