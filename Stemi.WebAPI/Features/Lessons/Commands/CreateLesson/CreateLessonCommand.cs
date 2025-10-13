using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Features.Lessons.Commands.CreateLesson
{
	public class CreateLessonCommand : IRequest<int>
	{
		public required string Subject { get; set; }
		public required string Teacher { get; set; }
		public int DirectoryGroupsId { get; set; }
		public int DirectoryTimeId { get; set; }
		public int NumberLecture { get; set; }
		public DateTime Date { get; set; }
		public int DirectoryCabinetsId { get; set; }
	}
	public class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, int>
	{
		private readonly ApplicationDbContext _context;

		public CreateLessonCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<int> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
		{
			// Проверяем существование связанных сущностей
			var directoryGroup = await _context.DirectoryGroups
				.FirstOrDefaultAsync(g => g.Id == request.DirectoryGroupsId, cancellationToken);
			var directoryTime = await _context.DirectoryTimes
				.FirstOrDefaultAsync(t => t.Id == request.DirectoryTimeId, cancellationToken);
			var directoryCabinet = await _context.DirectoryCabinets
				.FirstOrDefaultAsync(c => c.Id == request.DirectoryCabinetsId, cancellationToken);

			if (directoryGroup == null || directoryTime == null || directoryCabinet == null)
				throw new Exception("Одна из связанных сущностей не найдена");

			var lesson = new Lesson
			{
				Subject = request.Subject,
				Teacher = request.Teacher,
				DirectoryGroupsId = request.DirectoryGroupsId,
				DirectoryTimeId = request.DirectoryTimeId,
				NumberLecture = request.NumberLecture,
				Date = request.Date,
				DirectoryCabinetsId = request.DirectoryCabinetsId,
				// Инициализируем навигационные свойства
				DirectoryGroup = directoryGroup,
				DirectoryTime = directoryTime,
				DirectoryCabinets = directoryCabinet
			};

			_context.Lessons.Add(lesson);
			await _context.SaveChangesAsync(cancellationToken);

			return lesson.Id;
		}
	}
}