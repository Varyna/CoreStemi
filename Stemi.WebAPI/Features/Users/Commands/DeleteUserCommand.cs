using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Exceptions;

namespace Stemi.WebAPI.Features.Users.Commands
{
	public class DeleteUserCommand : IRequest
	{
		public string UserId { get; set; } = string.Empty;
		public string CurrentUserId { get; set; } = string.Empty;
	}

	public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
	{
		private readonly ApplicationDbContext _context;

		public DeleteUserCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
		{
			if (request.UserId == request.CurrentUserId)
				throw new BadRequestException("Нельзя удалить собственный аккаунт");

			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

			if (user == null)
				throw new NotFoundException($"Пользователь с ID {request.UserId} не найден");

			_context.Users.Remove(user);
			await _context.SaveChangesAsync(cancellationToken);
		}
	}
}