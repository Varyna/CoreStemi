using MediatR;
using Stemi.WebAPI.Data;

namespace Stemi.WebAPI.Features.Payments.Commands.UpdatePayment
{
	public class UpdatePaymentCommand : IRequest<Unit>
	{
		public int Id { get; set; }
		public string Value { get; set; }
		public DateTime PaymentDate { get; set; }
	}

	public class UpdatePaymentCommandHandler : IRequestHandler<UpdatePaymentCommand, Unit>
	{
		private readonly ApplicationDbContext _context;

		public UpdatePaymentCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Unit> Handle(UpdatePaymentCommand request, CancellationToken cancellationToken)
		{
			var payment = await _context.Payments.FindAsync(request.Id);
			if (payment == null)
				throw new Exception($"Платеж с ID {request.Id} не найден");

			payment.Value = request.Value;
			payment.PaymentDate = request.PaymentDate;

			await _context.SaveChangesAsync(cancellationToken);
			return Unit.Value;
		}
	}
}
