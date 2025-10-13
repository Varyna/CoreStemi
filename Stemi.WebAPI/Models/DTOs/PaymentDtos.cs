namespace Stemi.WebAPI.Models.DTOs
{
	public class PaymentDto
	{
		public int Id { get; set; }
		public Guid StudentsId { get; set; }
		public string Value { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime PaymentDate { get; set; }
	}
}
