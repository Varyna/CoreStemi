using System.ComponentModel.DataAnnotations;

namespace Stemi.WebAPI.Models.Entities
{
	public class User
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();

		[Required]
		[MaxLength(100)]
		public string UserName { get; set; } = string.Empty;

		[Required]
		[EmailAddress]
		[MaxLength(100)]
		public string Email { get; set; } = string.Empty;

		[Required]
		public string PasswordHash { get; set; } = string.Empty;

		public List<UserRole> Roles { get; set; } = new();
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}

	public enum UserRole
	{
		Student = 0,
		Admin = 1,
		Teacher = 2
	}

	public class LoginResponse
	{
		public string Token { get; set; } = string.Empty;
		public int ExpiresIn { get; set; }
		public string UserId { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty;
		public List<UserRole> Roles { get; set; } = new();
		public string Email { get; set; } = string.Empty;
	}
}
