using System.ComponentModel.DataAnnotations;

namespace Stemi.WebAPI.Models.Entities
{
	public class DirectoryGroups
	{
		[Key]
		public int Id { get; set; }
		public string Name { get; set; }
		public int Corpus { get; set; }
	}
}
