namespace Stemi.WebAPI.Features.Users.Models
{
	public class UserListResponse
	{
		public List<UserResponse> Users { get; set; } = new();
		public int TotalCount { get; set; }
	}
}
