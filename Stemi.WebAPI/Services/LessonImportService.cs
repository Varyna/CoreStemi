using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Features.Lessons.Commands.ImportLessonsFromExcel;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Services
{
	public interface ILessonImportService
	{
		Task<ImportResultDto> ImportLessonsAsync(List<Lesson> lessons);
	}

	public class LessonImportService : ILessonImportService
	{
		private readonly ApplicationDbContext _context;

		public LessonImportService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<ImportResultDto> ImportLessonsAsync(List<Lesson> lessons)
		{
			var result = new ImportResultDto();
			result.TotalRowsProcessed = lessons.Count;

			if (!lessons.Any())
				return result;

			var (startDate, endDate) = GetDateRange(lessons);
			var existingLessons = await GetExistingLessonsAsync(startDate, endDate);

			foreach (var lesson in lessons)
			{
				try
				{
					await ProcessLessonAsync(lesson, existingLessons);
					result.SuccessfullyImported++;
				}
				catch (Exception ex)
				{
					result.Failed++;
					result.Errors.Add($"Ошибка импорта: {ex.Message}");
				}
			}

			await _context.SaveChangesAsync();
			return result;
		}

		private  (DateTime Start, DateTime End) GetDateRange(List<Lesson> lessons)
		{
			var start = lessons.Min(x => x.Date);
			var end = lessons.Max(x => x.Date);
			return (start, end);
		}

		private async Task<List<Lesson>> GetExistingLessonsAsync(DateTime start, DateTime end)
		{
			return await _context.Lessons
				.Where(x => x.Date >= start && x.Date <= end)
				.Include(x => x.DirectoryGroup)
				.Include(x => x.DirectoryTime)
				.Include(x => x.DirectoryCabinets)
				.ToListAsync();
		}
		private async Task ProcessLessonAsync(Lesson newLesson, List<Lesson> existingLessons)
		{
			var existingLesson = FindExistingLesson(newLesson, existingLessons);

			if (existingLesson == null)
			{
				await AddNewLessonAsync(newLesson);
			}
			else
			{
				UpdateExistingLesson(existingLesson, newLesson);
			}
		}

		private  Lesson FindExistingLesson(Lesson newLesson, List<Lesson> existingLessons)
		{
			return existingLessons.FirstOrDefault(x =>
				x.Subject == newLesson.Subject &&
				x.Date == newLesson.Date &&
				x.DirectoryTime?.Name == newLesson.DirectoryTime?.Name);
		}

		private async Task AddNewLessonAsync(Lesson lesson)
		{
			// Загружаем связанные entity чтобы избежать дублирования
			lesson.DirectoryTime = await _context.DirectoryTimes.FindAsync(lesson.DirectoryTime.Id);
			lesson.DirectoryCabinets = await _context.DirectoryCabinets.FindAsync(lesson.DirectoryCabinets.Id);
			lesson.DirectoryGroup = await _context.DirectoryGroups.FindAsync(lesson.DirectoryGroup.Id);

			_context.Lessons.Add(lesson);
		}

		private  void UpdateExistingLesson(Lesson existing, Lesson newData)
		{
			existing.Subject = newData.Subject;
			existing.Teacher = newData.Teacher;
			existing.Date = newData.Date;
			existing.DirectoryTime = newData.DirectoryTime;
			existing.DirectoryCabinets = newData.DirectoryCabinets;
			existing.DirectoryGroup = newData.DirectoryGroup;
		}
	}
}
