using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Auth.Login.Commands;

namespace Stemi.WebAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ValuesController : ControllerBase
	{
		[HttpGet("Test")]
		public async Task<IActionResult> Test()
		{
			return Ok("IO");
		}
	}
}
