using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Features.Users.Models
{
	public class UserResponse
	{
		public string Id { get; set; } = string.Empty;
		public string UserName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public List<UserRole> Roles { get; set; } = new();
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public string Status { get; set; } = "active";
	}
}