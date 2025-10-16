using MediatR;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Schedule.Queries.GetSchedule;
	namespace Stemi.WebAPI.Controllers
	{
		[ApiController]
		[Route("api/[controller]")]
		public class ScheduleController : ControllerBase
		{
			private readonly IMediator _mediator;

			public ScheduleController(IMediator mediator)
			{
				_mediator = mediator;
			}

			[HttpPost]
			public async Task<IActionResult> GetSchedule([FromBody] GetScheduleRequest request)
			{
				var query = new GetScheduleQuery(request.Corpus, request.Date, request.Next);
				var result = await _mediator.Send(query);
				return Ok(result);
			}

			[HttpGet]
			public async Task<IActionResult> GetSchedule(
				[FromQuery] int? corpus = null,
				[FromQuery] DateTime? date = null,
				[FromQuery] bool next = false)
			{
				var query = new GetScheduleQuery(corpus, date, next);
				var result = await _mediator.Send(query);
				return Ok(result);
			}
		}
	}

