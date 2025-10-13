using System.ComponentModel.DataAnnotations;

namespace Stemi.WebAPI.Models.Entities
{
	public class Payment
	{
		[Key]
		public int Id { get; set; }
		public Guid StudentsId { get; set; }
		public string Value { get; set; }
		public virtual Student Student { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
	}
}
