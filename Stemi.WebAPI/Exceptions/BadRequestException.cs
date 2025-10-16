namespace Stemi.WebAPI.Exceptions
{
	public class BadRequestException : Exception
	{
		public BadRequestException(string message) : base(message) { }
	}
}
