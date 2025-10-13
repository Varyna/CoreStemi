using System.ComponentModel.DataAnnotations;

namespace Stemi.WebAPI.Models.Entities
{
	public class DirectoryTime
	{
		[Key]
		public int Id { get; set; }
		public string Name { get; set; }
	}
}
