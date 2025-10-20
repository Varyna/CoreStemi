namespace Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel
{
	public class ExcelImportDto
	{
		public string FilePath { get; set; }
		public Stream FileStream { get; set; }
		public DateTime WeekStartDate { get; set; }
	}

	public class ImportResultDto
	{
		public int TotalRowsProcessed { get; set; }
		public int SuccessfullyImported { get; set; }
		public int Failed { get; set; }
		public List<string> Errors { get; set; } = new();
		public bool IsSuccess => Failed == 0;

		public static ImportResultDto Failure(string errorMessage)
		{
			return new ImportResultDto
			{
				Errors = new List<string> { errorMessage }
			};
		}

	}
}
