namespace Stemi.WebAPI.Features.Users.Models
{
	public class ImportResult
	{
		public int SuccessfullyImported { get; set; }
		public int Failed { get; set; }
		public List<string> Errors { get; set; } = new();
	}
}
