using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ImportController : ControllerBase
	{
		private readonly IMediator _mediator;

		public ImportController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpPost("excel")]
		public async Task<ActionResult<ImportResultDto>> ImportExcel(IFormFile file)
		{
			if (file == null || file.Length == 0)
				return BadRequest("Файл не выбран");

			if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
				return BadRequest("Поддерживаются только .xlsx файлы");

			var command = new ImportLessonsFromExcelCommand { File = file };
			var result = await _mediator.Send(command);

			return Ok(result);
		}
	}
}
