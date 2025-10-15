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
		[HttpPost("users/excel")]
		public async Task<ActionResult> ImportUsersFromExcel(IFormFile file)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("Файл не предоставлен");
			}

			var allowedExtensions = new[] { ".xlsx", ".xls" };
			var fileExtension = Path.GetExtension(file.FileName).ToLower();

			if (!allowedExtensions.Contains(fileExtension))
			{
				return BadRequest("Разрешены только файлы Excel (.xlsx, .xls)");
			}

			if (file.Length > 10 * 1024 * 1024) // 10MB
			{
				return BadRequest("Размер файла не должен превышать 10MB");
			}

			try
			{
				using var stream = file.OpenReadStream();
				var result = await _mediator.Send(new ImportUsersFromExcelCommand(stream, file.FileName));

				var response = new
				{
					result.TotalRows,
					result.SuccessfullyImported,
					result.Failed,
					Errors = result.Errors.Take(50).ToList(), // Ограничиваем количество ошибок в ответе
					HasMoreErrors = result.Errors.Count > 50,
					ImportedUsers = result.ImportedUsers.Select(u => new
					{
						u.Id,
						u.UserName,
						u.Email,
						Roles = string.Join(", ", u.Roles)
					})
				};

				if (result.Failed > 0 && result.SuccessfullyImported == 0)
				{
					return BadRequest(response);
				}
				else if (result.Failed > 0)
				{	
					return StatusCode(207, response); // Multi-Status
				}

				return Ok(response);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Ошибка при импорте пользователей из Excel");
				return StatusCode(500, new { error = $"Произошла ошибка при импорте: {ex.Message}" });
			}
		}

		[HttpGet("users/template")]
		public IActionResult DownloadTemplate()
		{
			try
			{
				using var workbook = new XSSFWorkbook();
				var sheet = workbook.CreateSheet("Users");

				// Создаем заголовки
				var headerRow = sheet.CreateRow(0);
				headerRow.CreateCell(0).SetCellValue("UserName");
				headerRow.CreateCell(1).SetCellValue("Email");
				headerRow.CreateCell(2).SetCellValue("Password");
				headerRow.CreateCell(3).SetCellValue("Roles");

				// Добавляем примеры данных
				var exampleRow1 = sheet.CreateRow(1);
				exampleRow1.CreateCell(0).SetCellValue("john_doe");
				exampleRow1.CreateCell(1).SetCellValue("john@example.com");
				exampleRow1.CreateCell(2).SetCellValue("password123");
				exampleRow1.CreateCell(3).SetCellValue("Student");

				var exampleRow2 = sheet.CreateRow(2);
				exampleRow2.CreateCell(0).SetCellValue("jane_smith");
				exampleRow2.CreateCell(1).SetCellValue("jane@example.com");
				exampleRow2.CreateCell(2).SetCellValue("password456");
				exampleRow2.CreateCell(3).SetCellValue("Admin,Teacher");

				
				var stream = new MemoryStream();
				workbook.Write(stream, true);
				stream.Position = 0;

				return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Users_Import_Template.xlsx");
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Ошибка при создании шаблона Excel");
				return StatusCode(500, "Ошибка при создании шаблона");
			}
		}
	}
}
