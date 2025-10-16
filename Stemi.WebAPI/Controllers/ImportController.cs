using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NPOI.XSSF.UserModel;
using Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel;
using Stemi.WebAPI.Features.Users.Commands;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ImportController : ControllerBase
	{
		private readonly IMediator _mediator;
		private readonly ILogger<ImportController> _logger;
		public ImportController(IMediator mediator, ILogger<ImportController> logger)
		{
			_mediator = mediator;
			_logger = logger;
		}

		[HttpPost("ImportLessonsExcel")]
		public async Task<ActionResult<ImportResultDto>> ImportLessonsExcel(IFormFile file)
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
