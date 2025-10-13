using MediatR;
using Stemi.WebAPI.Data;

namespace Stemi.WebAPI.Features.Sessions.Commands.DeleteSession
{
	public class DeleteSessionCommand : IRequest<Unit>
	{
		public int Id { get; set; }
	}

	public class DeleteSessionCommandHandler : IRequestHandler<DeleteSessionCommand, Unit>
	{
		private readonly ApplicationDbContext _context;

		public DeleteSessionCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(DeleteSessionCommand request, CancellationToken cancellationToken)
		{
			var session = await _context.Sessions.FindAsync(request.Id);
			if (session == null)
				throw new Exception($"Сессия с ID {request.Id} не найдена");

			_context.Sessions.Remove(session);
			await _context.SaveChangesAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
