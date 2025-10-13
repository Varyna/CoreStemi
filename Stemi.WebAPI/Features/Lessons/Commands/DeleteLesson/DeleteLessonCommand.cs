using MediatR;
using Stemi.WebAPI.Data;

namespace Stemi.WebAPI.Features.Lessons.Commands.DeleteLesson
{
	public class DeleteLessonCommand : IRequest<Unit>
	{
		public int Id { get; set; }
	}

	public class DeleteLessonCommandHandler : IRequestHandler<DeleteLessonCommand, Unit>
	{
		private readonly ApplicationDbContext _context;

		public DeleteLessonCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
		{
			var lesson = await _context.Lessons.FindAsync(request.Id);
			if (lesson == null) throw new Exception("Lesson not found");

			_context.Lessons.Remove(lesson);
			await _context.SaveChangesAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
