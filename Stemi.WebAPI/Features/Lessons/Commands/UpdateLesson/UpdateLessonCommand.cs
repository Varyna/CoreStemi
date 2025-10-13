using MediatR;
using Stemi.WebAPI.Data;

namespace Stemi.WebAPI.Features.Lessons.Commands.UpdateLesson
{
	public class UpdateLessonCommand : IRequest<Unit>
	{
		public int Id { get; set; }
		public string Subject { get; set; }
		public string Teacher { get; set; }
		public int DirectoryGroupsId { get; set; }
		public int DirectoryTimeId { get; set; }
		public int NumberLecture { get; set; }
		public DateTime Date { get; set; }
		public int DirectoryCabinetsId { get; set; }
	}

	public class UpdateLessonCommandHandler : IRequestHandler<UpdateLessonCommand, Unit>
	{
		private readonly ApplicationDbContext _context;

		public UpdateLessonCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
		{
			var lesson = await _context.Lessons.FindAsync(request.Id);
			if (lesson == null) throw new Exception("Lesson not found");

			lesson.Subject = request.Subject;
			lesson.Teacher = request.Teacher;
			lesson.DirectoryGroupsId = request.DirectoryGroupsId;
			lesson.DirectoryTimeId = request.DirectoryTimeId;
			lesson.NumberLecture = request.NumberLecture;
			lesson.Date = request.Date;
			lesson.DirectoryCabinetsId = request.DirectoryCabinetsId;

			await _context.SaveChangesAsync(cancellationToken);
			return Unit.Value;
		}
	}
}
