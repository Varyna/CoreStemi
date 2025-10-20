using MediatR;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Services
{
	public interface IExcelParserService
	{
		Task<ExcelParseResult> ParseExcelFileAsync(ExcelImportDto excelData);
	}

	public class ExcelParserService : IExcelParserService
	{
		private readonly ApplicationDbContext _context;
		private readonly ILogger<ExcelParserService> _logger;

		public ExcelParserService(ApplicationDbContext context, ILogger<ExcelParserService> logger)
		{
			_context = context;
			_logger = logger;
		}

		public async Task<ExcelParseResult> ParseExcelFileAsync(ExcelImportDto excelData)
		{
			try
			{
				_logger.LogInformation("Начало обработки Excel файла");

				// Валидация входных данных
				var validationResult = ValidateExcelData(excelData);
				if (!validationResult.IsValid)
				{
					_logger.LogWarning("Валидация файла не пройдена: {ErrorMessage}", validationResult.ErrorMessage);
					return ExcelParseResult.Failure(validationResult.ErrorMessage);
				}

				IWorkbook workbook;
				try
				{
					workbook = await CreateWorkbookAsync(excelData.FileStream);
					_logger.LogInformation("Workbook успешно создан");
				}
				catch (Exception ex) when (ex is ICSharpCode.SharpZipLib.Zip.ZipException ||
										  ex is InvalidOperationException ||
										  ex is NPOI.OpenXml4Net.Exceptions.InvalidFormatException)
				{
					_logger.LogError(ex, "Ошибка чтения Excel файла");
					return ExcelParseResult.Failure("Невозможно прочитать Excel файл. Файл может быть поврежден или иметь неверный формат.");
				}

				using (workbook)
				{
					return await ParseWorkbookAsync(workbook, excelData.WeekStartDate);
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Неожиданная ошибка при парсинге Excel файла");
				return ExcelParseResult.Failure($"Ошибка обработки файла: {ex.Message}");
			}
		}

		private ExcelValidationResult ValidateExcelData(ExcelImportDto excelData)
		{
			if (excelData?.FileStream == null)
				return ExcelValidationResult.Invalid("Файл не предоставлен");

			if (!excelData.FileStream.CanRead)
				return ExcelValidationResult.Invalid("Невозможно прочитать файл");

			if (excelData.FileStream.Length == 0)
				return ExcelValidationResult.Invalid("Файл пустой");

			if (excelData.FileStream.Length < 100)
				return ExcelValidationResult.Invalid("Файл слишком мал для Excel файла");

			

			return ExcelValidationResult.Valid();
		}

		private async Task<IWorkbook> CreateWorkbookAsync(Stream fileStream)
		{
			// Создаем копию потока в памяти для надежности
			using var memoryStream = new MemoryStream();

			// Сбрасываем позицию исходного потока
			fileStream.Seek(0, SeekOrigin.Begin);
			await fileStream.CopyToAsync(memoryStream);
			memoryStream.Seek(0, SeekOrigin.Begin);

			try
			{
				// Пробуем как .xlsx (новый формат)
				_logger.LogInformation("Попытка открыть файл как .xlsx");
				return new XSSFWorkbook(memoryStream);
			}
			catch (Exception ex) when (ex is ICSharpCode.SharpZipLib.Zip.ZipException ||
									  ex is InvalidOperationException ||
									  ex is NPOI.OpenXml4Net.Exceptions.InvalidFormatException)
			{
				_logger.LogWarning(ex, "Ошибка при чтении как .xlsx, пробуем как .xls");

				// Пробуем как .xls (старый формат)
				try
				{
					memoryStream.Seek(0, SeekOrigin.Begin);
					return new HSSFWorkbook(memoryStream);
				}
				catch (Exception innerEx)
				{
					_logger.LogError(innerEx, "Оба формата не сработали");
					throw new InvalidOperationException($"Файл не является поддерживаемым форматом Excel (.xlsx или .xls): {innerEx.Message}");
				}
			}
		}

	

		private async Task<ExcelParseResult> ParseWorkbookAsync(IWorkbook workbook, DateTime weekStartDate)
		{
			_logger.LogInformation("Начало парсинга workbook. Количество листов: {SheetCount}", workbook.NumberOfSheets);

			var sheet = workbook.GetSheetAt(0);
			if (sheet == null)
			{
				_logger.LogWarning("Workbook не содержит листов");
				return ExcelParseResult.Failure("Excel файл не содержит листов");
			}

			_logger.LogInformation("Обработка листа: {SheetName}, строк: {RowCount}",
				sheet.SheetName, sheet.LastRowNum);

			var directoryData = await GetDirectoryDataAsync();
			var lessons = new List<Lesson>();
			string currentTeacher = "";

			for (int rowIndex = 3; rowIndex <= sheet.LastRowNum; rowIndex++)
			{
				var row = sheet.GetRow(rowIndex);
				if (row == null) continue;

				try
				{
					currentTeacher = UpdateCurrentTeacher(row, currentTeacher);
					var subject = GetCellValue(row.GetCell(2));

					if (string.IsNullOrEmpty(subject)) continue;

					await ProcessRowCellsAsync(row, sheet, weekStartDate, currentTeacher,
						subject, directoryData, lessons);
				}
				catch (Exception ex)
				{
					_logger.LogWarning(ex, "Ошибка при обработке строки {RowIndex}", rowIndex);
					// Продолжаем обработку следующих строк
				}
			}
			_logger.LogInformation("Парсинг завершен. Найдено {LessonsCount} уроков", lessons.Count);
			return ExcelParseResult.Success(lessons);
		}

		private async Task<DirectoryData> GetDirectoryDataAsync()
		{
			_logger.LogInformation("Загрузка справочных данных из БД");

			return new DirectoryData
			{
				Cabinets = await _context.DirectoryCabinets.AsNoTracking().ToListAsync(),
				Groups = await _context.DirectoryGroups.AsNoTracking().ToListAsync(),
				Times = await _context.DirectoryTimes.AsNoTracking().ToListAsync()
			};
		}

		private static string UpdateCurrentTeacher(IRow row, string currentTeacher)
		{
			var teacherCell = row.GetCell(1);
			var teacherValue = GetCellValue(teacherCell);

			return !string.IsNullOrEmpty(teacherValue)
				? teacherValue
				: currentTeacher;
		}

		private async Task ProcessRowCellsAsync(IRow row, ISheet sheet, DateTime weekStartDate,
			string teacher, string subject, DirectoryData directoryData, List<Lesson> lessons)
		{
			int currentDay = -1;

			for (int cellIndex = 3; cellIndex < GetLastCellNum(sheet); cellIndex++)
			{
				currentDay = UpdateCurrentDay(sheet, cellIndex, currentDay);
				var cellValue = GetCellValue(row.GetCell(cellIndex));

				if (string.IsNullOrEmpty(cellValue)) continue;

				var lectureNumber = GetLectureNumber(sheet, cellIndex);
				await ProcessCellValueAsync(cellValue, weekStartDate, currentDay, lectureNumber,
					teacher, subject, directoryData, lessons);
			}
		}

		private async Task ProcessCellValueAsync(string cellValue, DateTime weekStartDate, int day,
			int lectureNumber, string teacher, string subject, DirectoryData directoryData, List<Lesson> lessons)
		{
			var cellEntries = cellValue.Split('\n', StringSplitOptions.RemoveEmptyEntries);

			foreach (var entry in cellEntries)
			{
				var (groupName, cabinetName) = ParseGroupAndCabinet(entry);

				var lesson = await CreateLessonAsync(weekStartDate, day, lectureNumber, teacher,
					subject, groupName, cabinetName, directoryData);

				if (lesson != null)
					lessons.Add(lesson);
			}
		}

		private static (string GroupName, string CabinetName) ParseGroupAndCabinet(string entry)
		{
			var trimmedEntry = entry.Trim();
			var groupEndIndex = trimmedEntry.IndexOf(' ');

			if (groupEndIndex == -1)
				return (trimmedEntry, "");

			var groupName = trimmedEntry[..groupEndIndex];
			var cabinetPart = trimmedEntry[(groupEndIndex + 1)..].Trim();

			// Убираем скобки если есть
			var cabinetName = cabinetPart
				.Replace("(", "")
				.Replace(")", "")
				.Trim();

			return (groupName, cabinetName);
		}

		private async Task<Lesson> CreateLessonAsync(DateTime weekStartDate, int day, int lectureNumber,
			string teacher, string subject, string groupName, string cabinetName, DirectoryData directoryData)
		{
			var group = directoryData.Groups.FirstOrDefault(g => g.Name == groupName);
			var cabinet = directoryData.Cabinets.FirstOrDefault(c => c.Name == cabinetName);
			var time = directoryData.Times.FirstOrDefault(t => t.Id == lectureNumber);

			if (group == null)
			{
				_logger.LogWarning("Группа не найдена: {GroupName}", groupName);
				return null;
			}

			if (cabinet == null)
			{
				_logger.LogWarning("Кабинет не найден: {CabinetName}", cabinetName);
				return null;
			}

			if (time == null)
			{
				_logger.LogWarning("Время не найдено для номера пары: {LectureNumber}", lectureNumber);
				return null;
			}

			return new Lesson
			{
				Date = weekStartDate.AddDays(day),
				NumberLecture = lectureNumber,
				Subject = subject,
				Teacher = teacher,
				DirectoryCabinets = cabinet,
				DirectoryGroup = group,
				DirectoryTime = time
			};
		}

		private static int GetLastCellNum(ISheet sheet)
		{
			var headerRow = sheet.GetRow(1);
			if (headerRow == null) return 50;

			for (int i = 1; i < 100; i++)
			{
				var cellValue = headerRow.GetCell(i)?.ToString();
				if (cellValue?.Contains("Суббота") == true)
					return i + 15;
			}
			return 50; // fallback
		}

		private static int UpdateCurrentDay(ISheet sheet, int cellIndex, int currentDay)
		{
			var lectureCell = sheet.GetRow(2)?.GetCell(cellIndex)?.ToString();
			if (int.TryParse(lectureCell, out int lectureNum) && lectureNum == 1)
			{
				return currentDay + 1;
			}
			return currentDay;
		}

		private static int GetLectureNumber(ISheet sheet, int cellIndex)
		{
			var lectureCell = sheet.GetRow(2)?.GetCell(cellIndex)?.ToString();
			return int.TryParse(lectureCell, out int num) ? num : 1;
		}

		private static string GetCellValue(ICell cell)
		{
			if (cell == null) return "";

			try
			{
				return cell.CellType switch
				{
					CellType.String => cell.StringCellValue?.Trim() ?? "",
					CellType.Numeric => DateUtil.IsCellDateFormatted(cell)
						? cell.DateCellValue.ToString()
						: cell.NumericCellValue.ToString().Trim(),
					CellType.Boolean => cell.BooleanCellValue.ToString(),
					CellType.Formula => cell.ToString()?.Trim() ?? "",
					_ => cell.ToString()?.Trim() ?? ""
				};
			}
			catch
			{
				return cell.ToString()?.Trim() ?? "";
			}
		}
	}

	// DTO и результаты
	public record ExcelParseResult(bool IsSuccess, List<Lesson> Lessons, string ErrorMessage = "")
	{
		public static ExcelParseResult Success(List<Lesson> lessons) => new(true, lessons);
		public static ExcelParseResult Failure(string error) => new(false, new List<Lesson>(), error);
	}

	public record ExcelValidationResult(bool IsValid, string ErrorMessage = "")
	{
		public static ExcelValidationResult Valid() => new(true);
		public static ExcelValidationResult Invalid(string error) => new(false, error);
	}

	public class DirectoryData
	{
		public List<DirectoryCabinets> Cabinets { get; set; } = new();
		public List<DirectoryGroups> Groups { get; set; } = new();
		public List<DirectoryTime> Times { get; set; } = new();
	}
}