using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Auth.Login.Commands;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IMediator _mediator;

		public AuthController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequest request)
		{
			var command = new LoginCommand(request.Email, request.Password);
			var result = await _mediator.Send(command);

			if (!result.Success)
			{
				return Unauthorized(new { message = result.ErrorMessage });
			}

			return Ok(result.Response);
		}
	}

	public record LoginRequest(string Email, string Password);
}
