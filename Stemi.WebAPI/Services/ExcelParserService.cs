using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Services
{
	public interface IExcelParserService
	{
		Task<List<Lesson>> ParseExcelFileAsync(ExcelImportDto excelData);
	}

	public class ExcelParserService : IExcelParserService
	{
		private readonly ApplicationDbContext _context;

		public ExcelParserService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<List<Lesson>> ParseExcelFileAsync(ExcelImportDto excelData)
		{
			var lessons = new List<Lesson>();
			var directoryData = await GetDirectoryDataAsync();

			using var workbook = new XSSFWorkbook(excelData.FileStream);
			var sheet = workbook.GetSheetAt(0);

			string currentTeacher = "";

			for (int rowIndex = 3; rowIndex <= sheet.LastRowNum; rowIndex++)
			{
				var row = sheet.GetRow(rowIndex);
				if (row == null) continue;

				currentTeacher = UpdateCurrentTeacher(row, currentTeacher);
				var subject = GetCellValue(row.GetCell(2));

				if (string.IsNullOrEmpty(subject)) continue;

				await ProcessRowCellsAsync(row, sheet, excelData.WeekStartDate, currentTeacher, subject, directoryData, lessons);
			}

			return lessons;
		}

		private async Task<DirectoryData> GetDirectoryDataAsync()
		{
			return new DirectoryData
			{
				Cabinets = await _context.DirectoryCabinets.ToListAsync(),
				Groups = await _context.DirectoryGroups.ToListAsync(),
				Times = await _context.DirectoryTimes.ToListAsync()
			};
		}

		private static string UpdateCurrentTeacher(IRow row, string currentTeacher)
		{
			var teacherCell = row.GetCell(1);
			return !string.IsNullOrEmpty(teacherCell?.ToString())
				? teacherCell.ToString()
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
			var groupEndIndex = entry.IndexOf(' ');
			if (groupEndIndex == -1)
				return (entry, "");

			var groupName = entry[..groupEndIndex];
			var cabinetName = entry[(groupEndIndex + 1)..]
				.Replace(" (", "")
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

			if (group == null || cabinet == null || time == null)
				return null;

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
			for (int i = 1; i < 100; i++)
			{
				var cellValue = sheet.GetRow(1)?.GetCell(i)?.ToString();
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
			return cell?.ToString()?.Trim() ?? "";
		}
	}

	public class DirectoryData
	{
		public List<DirectoryCabinets> Cabinets { get; set; }
		public List<DirectoryGroups> Groups { get; set; }
		public List<DirectoryTime> Times { get; set; }
	}
}
