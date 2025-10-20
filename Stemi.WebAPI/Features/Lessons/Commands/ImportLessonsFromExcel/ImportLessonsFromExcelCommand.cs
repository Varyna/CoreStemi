using MediatR;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Services;

namespace Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel
{
		public class ImportLessonsFromExcelCommand : IRequest<ImportResultDto>
		{
			public IFormFile File { get; set; }
		}
		public class ImportLessonsFromExcelCommandHandler : IRequestHandler<ImportLessonsFromExcelCommand, ImportResultDto>
		{
			private readonly ApplicationDbContext _context;
			private readonly IExcelParserService _excelParserService;
			private readonly ILessonImportService _lessonImportService;
			private readonly ILogger<ImportLessonsFromExcelCommandHandler> _logger;

			public ImportLessonsFromExcelCommandHandler(
				ApplicationDbContext context,
				IExcelParserService excelParserService,
				ILessonImportService lessonImportService,
				ILogger<ImportLessonsFromExcelCommandHandler> logger)
			{
				_context = context;
				_excelParserService = excelParserService;
				_lessonImportService = lessonImportService;
				_logger = logger;
			}
			public async Task<ImportResultDto> Handle(ImportLessonsFromExcelCommand request, CancellationToken cancellationToken)
			{
				try
				{
				// Валидация файла
				if (request.File == null || request.File.Length == 0)
				{
					return ImportResultDto.Failure("Файл не предоставлен или пустой");
				}

				if (!IsExcelFile(request.File))
				{
					return ImportResultDto.Failure("Поддерживаются только Excel файлы (.xlsx)");
				}

				using var stream = new MemoryStream();
					await request.File.CopyToAsync(stream, cancellationToken);

					var excelData = new ExcelImportDto
					{
						FileStream = stream,
						WeekStartDate = ExtractDateFromFileName(request.File.FileName)
					};

					// Парсинг Excel
					var parseResult = await _excelParserService.ParseExcelFileAsync(excelData);

				if (!parseResult.IsSuccess)
				{
					return ImportResultDto.Failure(parseResult.ErrorMessage);
				}

				if (!parseResult.Lessons.Any())
				{
					return ImportResultDto.Failure("В файле не найдено данных для импорта");
				}

				// Импорт уроков
				var importResult = await _lessonImportService.ImportLessonsAsync(parseResult.Lessons);

					_logger.LogInformation("Успешно импортировано {Count} уроков из файла {FileName}",
						parseResult.Lessons.Count, request.File.FileName);

					return importResult;
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Ошибка при импорте уроков из файла {FileName}", request.File?.FileName);
					return ImportResultDto.Failure($"Ошибка импорта: {ex.Message}");
				}
			}

			private static bool IsExcelFile(IFormFile file)
			{
				var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
				return extension == ".xlsx";
			}

			private static DateTime ExtractDateFromFileName(string fileName)
			{
				var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
				return DateTime.TryParse(fileNameWithoutExtension, out var date)
					? date
					: DateTime.Now;
			}
		}
	}
