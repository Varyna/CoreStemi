using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Lessons.Commands.CreateLesson;
using Stemi.WebAPI.Features.Sessions.Commands.DeleteSession;
using Stemi.WebAPI.Features.Sessions.Commands.UpdateSession;
using Stemi.WebAPI.Features.Sessions.Queries.GetSessionById;
using Stemi.WebAPI.Features.Sessions.Queries.GetStudentSessions;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class SessionsController : ControllerBase
	{
		private readonly IMediator _mediator;

		public SessionsController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpGet("student/{studentId}")]
		public async Task<ActionResult<List<SessionDto>>> GetStudentSessions(Guid studentId)
		{
			var sessions = await _mediator.Send(new GetStudentSessionsQuery { StudentId = studentId });
			return Ok(sessions);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<SessionDto>> GetSession(int id)
		{
			var session = await _mediator.Send(new GetSessionByIdQuery { Id = id });
			return session != null ? Ok(session) : NotFound();
		}

		[HttpPost]
		public async Task<ActionResult<int>> CreateSession(CreateLessonCommand command)
		{
			var sessionId = await _mediator.Send(command);
			return CreatedAtAction(nameof(GetSession), new { id = sessionId }, sessionId);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateSession(int id, UpdateSessionCommand command)
		{
			if (id != command.Id) return BadRequest();
			await _mediator.Send(command);
			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSession(int id)
		{
			await _mediator.Send(new DeleteSessionCommand { Id = id });
			return NoContent();
		}
	}
}
