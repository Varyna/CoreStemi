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

		public ImportLessonsFromExcelCommandHandler(
			ApplicationDbContext context,
			IExcelParserService excelParserService,
			ILessonImportService lessonImportService)
		{
			_context = context;
			_excelParserService = excelParserService;
			_lessonImportService = lessonImportService;
		}

		public async Task<ImportResultDto> Handle(ImportLessonsFromExcelCommand request, CancellationToken cancellationToken)
		{
			using var stream = new MemoryStream();
			await request.File.CopyToAsync(stream, cancellationToken);

			var excelData = new ExcelImportDto
			{
				FileStream = stream,
				WeekStartDate = ExtractDateFromFileName(request.File.FileName)
			};

			var lessons = await _excelParserService.ParseExcelFileAsync(excelData);
			var result = await _lessonImportService.ImportLessonsAsync(lessons);

			return result;
		}

		private static DateTime ExtractDateFromFileName(string fileName)
		{
			// Логика извлечения даты из имени файла
			var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
			return DateTime.TryParse(fileNameWithoutExtension, out var date)
				? date
				: DateTime.Now;
		}
	}
}
