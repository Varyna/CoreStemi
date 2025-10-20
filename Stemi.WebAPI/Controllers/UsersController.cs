using MediatR;
using Microsoft.AspNetCore.Mvc;
using NPOI.XSSF.UserModel;
using Stemi.WebAPI.Exceptions;
using Stemi.WebAPI.Features.Users.Commands;
using Stemi.WebAPI.Features.Users.Models;
using Stemi.WebAPI.Features.Users.Queries;
using System.Security.Claims;

namespace Stemi.WebAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class UsersController : ControllerBase
	{
		private readonly IMediator _mediator;
		private readonly ILogger<UsersController> _logger;
		public UsersController(IMediator mediator, ILogger<UsersController> logger)
		{
			_mediator = mediator;
			_logger = logger;
		}
		[HttpPost("users/import")]
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
		[HttpGet]
		public async Task<ActionResult<UserListResponse>> GetAllUsers()
		{
			_logger.LogInformation("Запрос на получение списка пользователей. User: {UserId}",
				User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

			try
			{
				var result = await _mediator.Send(new GetAllUsersQuery());
				_logger.LogInformation("Успешно получено {Count} пользователей", result.Users.Count);
				return Ok(result);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Ошибка при получении списка пользователей");
				throw; // Исключение будет обработано middleware
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<UserResponse>> GetUserById(string id)
		{
			_logger.LogInformation("Запрос на получение пользователя по ID: {UserId}. Запросил: {CurrentUserId}",
				id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

			try
			{
				var result = await _mediator.Send(new GetUserByIdQuery { UserId = id });
				_logger.LogInformation("Пользователь {UserId} успешно получен", id);
				return Ok(result);
			}
			catch (NotFoundException ex)
			{
				_logger.LogWarning("Пользователь с ID {UserId} не найден", id);
				throw;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Ошибка при получении пользователя по ID: {UserId}", id);
				throw;
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteUser(string id)
		{
			var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			_logger.LogInformation("Запрос на удаление пользователя {UserId}. Инициатор: {CurrentUserId}",
				id, currentUserId);

			try
			{
				await _mediator.Send(new DeleteUserCommand
				{
					UserId = id,
					CurrentUserId = currentUserId ?? string.Empty
				});

				_logger.LogInformation("Пользователь {UserId} успешно удален. Инициатор: {CurrentUserId}",
					id, currentUserId);

				return NoContent();
			}
			catch (BadRequestException ex)
			{
				_logger.LogWarning("Некорректный запрос на удаление пользователя {UserId}: {Message}",
					id, ex.Message);
				throw;
			}
			catch (NotFoundException ex)
			{
				_logger.LogWarning("Попытка удаления несуществующего пользователя {UserId}", id);
				throw;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Ошибка при удалении пользователя {UserId}", id);
				throw;
			}
		}
	}
}
