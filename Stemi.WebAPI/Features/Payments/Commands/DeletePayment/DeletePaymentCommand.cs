using MediatR;
using Stemi.WebAPI.Data;

namespace Stemi.WebAPI.Features.Payments.Commands.DeletePayment
{
	public class DeletePaymentCommand : IRequest<Unit>
	{
		public int Id { get; set; }
	}

	public class DeletePaymentCommandHandler : IRequestHandler<DeletePaymentCommand, Unit>
	{
		private readonly ApplicationDbContext _context;

		public DeletePaymentCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
		{
			var payment = await _context.Payments.FindAsync(request.Id);
			if (payment == null)
				throw new Exception($"Платеж с ID {request.Id} не найден");

			_context.Payments.Remove(payment);
			await _context.SaveChangesAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
