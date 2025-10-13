using MediatR;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Lessons.Commands.CreateLesson;
using Stemi.WebAPI.Features.Lessons.Commands.DeleteLesson;
using Stemi.WebAPI.Features.Lessons.Commands.UpdateLesson;
using Stemi.WebAPI.Features.Lessons.Queries.GetLessonById;
using Stemi.WebAPI.Features.Lessons.Queries.GetLessons;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class LessonsController : ControllerBase
	{
		private readonly IMediator _mediator;

		public LessonsController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpGet]
		public async Task<ActionResult<List<LessonDto>>> GetLessons()
		{
			var lessons = await _mediator.Send(new GetLessonsQuery());
			return Ok(lessons);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<LessonDto>> GetLesson(int id)
		{
			var lesson = await _mediator.Send(new GetLessonByIdQuery { Id = id });
			return lesson != null ? Ok(lesson) : NotFound();
		}

		[HttpPost]
		public async Task<ActionResult<int>> CreateLesson(CreateLessonCommand command)
		{
			var lessonId = await _mediator.Send(command);
			return CreatedAtAction(nameof(GetLesson), new { id = lessonId }, lessonId);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateLesson(int id, UpdateLessonCommand command)
		{
			if (id != command.Id) return BadRequest();
			await _mediator.Send(command);
			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteLesson(int id)
		{
			await _mediator.Send(new DeleteLessonCommand { Id = id });
			return NoContent();
		}
	}
}