using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Models.DTOs
{
	public class UserImportDto
	{
		public string UserName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		public string Roles { get; set; } = string.Empty;
	}
	public class UserImportResult
	{
		public int TotalRows { get; set; }
		public int SuccessfullyImported { get; set; }
		public int Updated { get; set; } // ← Добавьте это свойство
		public int Failed { get; set; }
		public List<string> Errors { get; set; } = new List<string>();
		public List<User> ImportedUsers { get; set; } = new List<User>();
	}
}
