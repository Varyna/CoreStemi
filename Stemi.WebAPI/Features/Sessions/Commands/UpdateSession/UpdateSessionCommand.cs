using MediatR;
using Stemi.WebAPI.Data;

namespace Stemi.WebAPI.Features.Sessions.Commands.UpdateSession
{
	public class UpdateSessionCommand : IRequest<Unit>
	{
		public int Id { get; set; }
		public string? ControlType { get; set; }
		public int? SessionCourse { get; set; }
		public string? SessionName { get; set; }
		public string? SessionYear { get; set; }
		public string? Subject { get; set; }
		public string? NameStudents { get; set; }
		public string? Score { get; set; }
		public int Relevance { get; set; }
		public string? Group { get; set; }
	}

	public class UpdateSessionCommandHandler : IRequestHandler<UpdateSessionCommand, Unit>
	{
		private readonly ApplicationDbContext _context;

		public UpdateSessionCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(UpdateSessionCommand request, CancellationToken cancellationToken)
		{
			var session = await _context.Sessions.FindAsync(request.Id);
			if (session == null)
				throw new Exception($"Сессия с ID {request.Id} не найдена");

			session.ControlType = request.ControlType;
			session.SessionCourse = request.SessionCourse;
			session.SessionName = request.SessionName;
			session.SessionYear = request.SessionYear;
			session.Subject = request.Subject;
			session.NameStudents = request.NameStudents;
			session.Score = request.Score;
			session.Relevance = request.Relevance;
			session.Group = request.Group;

			await _context.SaveChangesAsync(cancellationToken);
			return Unit.Value;
		}
	}
}
