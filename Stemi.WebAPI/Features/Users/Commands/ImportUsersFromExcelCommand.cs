using MediatR;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;
using Stemi.WebAPI.Models.Entities;
using System.Globalization;

namespace Stemi.WebAPI.Features.Users.Commands
{
	
	public record ImportUsersFromExcelCommand(Stream FileStream, string FileName) : IRequest<UserImportResult>;
	public class ImportUsersFromExcelCommandHandler : IRequestHandler<ImportUsersFromExcelCommand, UserImportResult>
	{
		private readonly ApplicationDbContext _context;
		private readonly IMediator _mediator;
		private readonly ILogger<ImportUsersFromExcelCommandHandler> _logger;

		public ImportUsersFromExcelCommandHandler(
			ApplicationDbContext context,
			IMediator mediator,
			ILogger<ImportUsersFromExcelCommandHandler> logger)
		{
			_context = context;
			_mediator = mediator;
			_logger = logger;
		}

		public async Task<UserImportResult> Handle(ImportUsersFromExcelCommand request, CancellationToken cancellationToken)
		{
			var result = new UserImportResult();
			var usersToImport = new List<UserImportDto>();

			try
			{
				// Создание workbook в зависимости от типа файла
				IWorkbook workbook;
				if (request.FileName.EndsWith(".xlsx"))
				{
					workbook = new XSSFWorkbook(request.FileStream);
				}
				else if (request.FileName.EndsWith(".xls"))
				{
					workbook = new HSSFWorkbook(request.FileStream);
				}
				else
				{
					result.Errors.Add("Неподдерживаемый формат файла. Используйте .xls или .xlsx");
					return result;
				}

				var worksheet = workbook.GetSheetAt(0); // Первый лист

				if (worksheet == null || worksheet.PhysicalNumberOfRows == 0)
				{
					result.Errors.Add("Файл не содержит рабочих листов или данных");
					return result;
				}

				// Парсинг данных из Excel
				usersToImport = ParseExcelData(worksheet, result);
				result.TotalRows = usersToImport.Count;

				// Импорт пользователей
				await ImportUsers(usersToImport, result, cancellationToken);

				workbook.Close();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Ошибка при импорте пользователей из Excel файла {FileName}", request.FileName);
				result.Errors.Add($"Ошибка обработки файла: {ex.Message}");
			}

			return result;
		}

		private List<UserImportDto> ParseExcelData(ISheet worksheet, UserImportResult result)
		{
			var users = new List<UserImportDto>();
			var rowCount = worksheet.LastRowNum + 1;
			var emailSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

			if (rowCount < 2)
			{
				result.Errors.Add("Файл не содержит данных для импорта (только заголовки)");
				return users;
			}

			// Чтение заголовков
			var headerRow = worksheet.GetRow(0);
			if (headerRow == null)
			{
				result.Errors.Add("Не удалось прочитать строку заголовков");
				return users;
			}

			var headers = new Dictionary<string, int>();
			for (int col = 0; col < headerRow.LastCellNum; col++)
			{
				var cell = headerRow.GetCell(col);
				if (cell != null)
				{
					var header = cell.ToString()?.ToLower().Trim();
					if (!string.IsNullOrEmpty(header))
					{
						headers[header] = col;
					}
				}
			}

			// Проверка обязательных колонок
			var requiredColumns = new[] { "username", "email", "password" };
			foreach (var column in requiredColumns)
			{
				if (!headers.ContainsKey(column))
				{
					result.Errors.Add($"Отсутствует обязательная колонка: {column}");
				}
			}

			if (result.Errors.Any())
				return users;

			// Чтение данных
			for (int rowIndex = 1; rowIndex < rowCount; rowIndex++)
			{
				var row = worksheet.GetRow(rowIndex);
				if (row == null) continue;

				try
				{
					var userDto = new UserImportDto
					{
						UserName = GetCellValue(row, headers["username"])?.Trim() ?? "",
						Email = GetCellValue(row, headers["email"])?.Trim() ?? "",
						Password = GetCellValue(row, headers["password"])?.Trim() ?? "",
						Roles = headers.ContainsKey("roles")
							? GetCellValue(row, headers["roles"])?.Trim() ?? "Student"
							: "Student"
					};

					// Валидация базовых полей
					if (string.IsNullOrWhiteSpace(userDto.UserName))
					{
						result.Errors.Add($"Строка {rowIndex + 1}: Отсутствует имя пользователя");
						continue;
					}

					if (string.IsNullOrWhiteSpace(userDto.Email))
					{
						result.Errors.Add($"Строка {rowIndex + 1}: Отсутствует email");
						continue;
					}

					if (string.IsNullOrWhiteSpace(userDto.Password))
					{
						result.Errors.Add($"Строка {rowIndex + 1}: Отсутствует пароль");
						continue;
					}

					// Проверка на дубликаты в файле
					if (emailSet.Contains(userDto.Email))
					{
						result.Errors.Add($"Строка {rowIndex + 1}: Дубликат email в файле: {userDto.Email}");
						continue;
					}

					emailSet.Add(userDto.Email);
					users.Add(userDto);
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Ошибка при парсинге строки {Row} из Excel", rowIndex + 1);
					result.Errors.Add($"Строка {rowIndex + 1}: Ошибка обработки данных");
				}
			}
			return users;
		}
		private string? GetCellValue(IRow row, int columnIndex)
		{
			if (columnIndex < 0) return null;

			var cell = row.GetCell(columnIndex);
			if (cell == null) return null;

			try
			{
				switch (cell.CellType)
				{
					case CellType.String:
						return cell.StringCellValue;

					case CellType.Numeric:
						if (DateUtil.IsCellDateFormatted(cell))
						{
							return cell.DateCellValue.ToString();
						}
						return cell.NumericCellValue.ToString(CultureInfo.InvariantCulture);

					case CellType.Boolean:
						return cell.BooleanCellValue.ToString();

					case CellType.Formula:
						// Для формул пытаемся получить вычисленное значение
						try
						{
							var formulaEvaluator = cell.Sheet.Workbook.GetCreationHelper().CreateFormulaEvaluator();
							var evaluatedCell = formulaEvaluator.Evaluate(cell);

							switch (evaluatedCell.CellType)
							{
								case CellType.String:
									return evaluatedCell.StringValue;
								case CellType.Numeric:
									return evaluatedCell.NumberValue.ToString(CultureInfo.InvariantCulture);
								case CellType.Boolean:
									return evaluatedCell.BooleanValue.ToString();
								default:
									return cell.ToString();
							}
						}
						catch
						{
							return cell.ToString();
						}

					case CellType.Blank:
						return string.Empty;

					default:
						return cell.ToString();
				}
			}
			catch
			{
				return cell.ToString();
			}
		}


		
		private bool IsValidEmail(string email)
		{
			try
			{
				var addr = new System.Net.Mail.MailAddress(email);
				return addr.Address == email;
			}
			catch
			{
				return false;
			}
		}
		private async Task ImportUsers(List<UserImportDto> usersToImport, UserImportResult result, CancellationToken cancellationToken)
		{
			// Обрабатываем дубликаты ВНУТРИ файла импорта
			var processedEmails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
			var duplicateEmailsInFile = new HashSet<string>();

			// Фильтруем дубликаты внутри файла
			var uniqueUsersToImport = new List<UserImportDto>();

			foreach (var userDto in usersToImport)
			{
				var normalizedEmail = userDto.Email.ToLower().Trim();

				if (processedEmails.Contains(normalizedEmail))
				{
					// Найден дубликат в файле импорта
					duplicateEmailsInFile.Add(normalizedEmail);
					result.Errors.Add($"Дубликат email в файле: {userDto.Email}");
					result.Failed++;
					continue;
				}

				processedEmails.Add(normalizedEmail);
				uniqueUsersToImport.Add(userDto);
			}

			// Логируем дубликаты в файле
			if (duplicateEmailsInFile.Any())
			{
				_logger.LogWarning("Найдены дубликаты email в файле импорта: {Duplicates}",
					string.Join(", ", duplicateEmailsInFile));
			}

			// Получаем существующих пользователей по email
			var existingUsers = await _context.Users
				.Where(u => uniqueUsersToImport.Select(ui => ui.Email.ToLower()).Contains(u.Email.ToLower()))
				.ToDictionaryAsync(u => u.Email.ToLower(), u => u, cancellationToken);

			using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

			try
			{
				foreach (var userDto in uniqueUsersToImport)
				{
					try
					{
						var normalizedEmail = userDto.Email.ToLower();

						if (existingUsers.TryGetValue(normalizedEmail, out var existingUser))
						{
							// ОБНОВЛЯЕМ существующего пользователя
							existingUser.UserName = userDto.UserName;
							existingUser.PasswordHash = HashPassword(userDto.Password);
							existingUser.Roles = ParseRoles(userDto.Roles);
							existingUser.UpdatedAt = DateTime.UtcNow;

							result.Updated++;
							result.ImportedUsers.Add(existingUser);

							_logger.LogInformation("Обновлен пользователь: {Email}", userDto.Email);
						}
						else
						{
							// СОЗДАЕМ нового пользователя
							// Дополнительная проверка на случай конкурентности
							var emailExists = await _context.Users
								.AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

							if (emailExists)
							{
								result.Errors.Add($"Пользователь с email {userDto.Email} уже существует в базе данных");
								result.Failed++;
								continue;
							}

							var user = new User
							{
								UserName = userDto.UserName,
								Email = userDto.Email,
								PasswordHash = HashPassword(userDto.Password),
								Roles = ParseRoles(userDto.Roles),
								CreatedAt = DateTime.UtcNow
							};

							_context.Users.Add(user);
							result.ImportedUsers.Add(user);
							result.SuccessfullyImported++;

							_logger.LogInformation("Создан новый пользователь: {Email}", userDto.Email);
						}
					}
					catch (Exception ex)
					{
						_logger.LogError(ex, "Ошибка при обработке пользователя {UserName}", userDto.UserName);
						result.Errors.Add($"Ошибка обработки пользователя {userDto.UserName}: {ex.Message}");
						result.Failed++;
					}
				}

				// Сохраняем все изменения с обработкой исключений
				try
				{
					await _context.SaveChangesAsync(cancellationToken);
					await transaction.CommitAsync(cancellationToken);

					_logger.LogInformation("Импорт завершен: создано {Created}, обновлено {Updated}, ошибок {Failed}",
						result.SuccessfullyImported, result.Updated, result.Failed);
				}
				catch (DbUpdateException dbEx)
				{
					// Обрабатываем ошибки сохранения более детально
					await HandleSaveChangesException(dbEx, result, uniqueUsersToImport.Count);
					throw; // Пробрасываем исключение для внешнего catch
				}
			}
			catch (DbUpdateException dbEx)
			{
				await transaction.RollbackAsync(cancellationToken);

				if (dbEx.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
				{
					var constraintName = pgEx.ConstraintName;
					var detailedMessage = constraintName switch
					{
						"IX_Users_Email" => "Обнаружены дублирующиеся email-адреса. Проверьте файл на уникальность email.",
						"IX_Users_UserName" => "Обнаружены дублирующиеся имена пользователей. Проверьте файл на уникальность имен.",
						_ => "Обнаружены дублирующиеся данные. Проверьте файл на уникальность."
					};

					_logger.LogError(dbEx, "Нарушение уникальности при импорте пользователей: {Constraint}", constraintName);
					result.Errors.Add(detailedMessage);
				}
				else
				{
					_logger.LogError(dbEx, "Ошибка базы данных при импорте пользователей");
					result.Errors.Add($"Ошибка базы данных: {dbEx.Message}");
				}

				result.Failed = uniqueUsersToImport.Count;
				result.SuccessfullyImported = 0;
				result.Updated = 0;
				result.ImportedUsers.Clear();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync(cancellationToken);
				_logger.LogError(ex, "Неожиданная ошибка при сохранении импортированных пользователей");
				result.Errors.Add($"Ошибка при сохранении данных: {ex.Message}");
				result.Failed = uniqueUsersToImport.Count;
				result.SuccessfullyImported = 0;
				result.Updated = 0;
				result.ImportedUsers.Clear();
			}
		}

		private async Task HandleSaveChangesException(DbUpdateException dbEx, UserImportResult result, int totalUsers)
		{
			if (dbEx.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
			{
				// Получаем детальную информацию об ошибке
				var constraintName = pgEx.ConstraintName;
				var tableName = pgEx.TableName;

				_logger.LogError("Constraint violation: {Constraint} on table {Table}", constraintName, tableName);

				// Можно добавить логику для определения конкретного проблемного email
				result.Errors.Add($"Нарушение уникальности: {constraintName}. Возможно, в файле есть дубликаты или конфликты с существующими данными.");
			}
		}

		private List<UserRole> ParseRoles(string rolesString)
		{
			var roles = new List<UserRole>();
			if (string.IsNullOrWhiteSpace(rolesString))
				return roles;

			var roleNames = rolesString.Split(new[] { ',', ';', '|', '/', ' ' }, StringSplitOptions.RemoveEmptyEntries);

			foreach (var roleName in roleNames)
			{
				var trimmedRole = roleName.Trim();
				if (Enum.TryParse<UserRole>(trimmedRole, true, out var role))
				{
					if (!roles.Contains(role))
					{
						roles.Add(role);
					}
				}
				else
				{
					// Попробуем найти роль по числовому значению
					if (int.TryParse(trimmedRole, out var roleNumber) &&
						Enum.IsDefined(typeof(UserRole), roleNumber))
					{
						var numericRole = (UserRole)roleNumber;
						if (!roles.Contains(numericRole))
						{
							roles.Add(numericRole);
						}
					}
				}
			}

			return roles;
		}

		private string HashPassword(string password)
		{
			// Используем BCrypt для хеширования паролей
			return BCrypt.Net.BCrypt.HashPassword(password);
		}
	}
}