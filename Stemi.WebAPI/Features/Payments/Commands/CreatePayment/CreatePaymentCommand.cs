using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Features.Payments.Commands.CreatePayment
{
	public class CreatePaymentCommand : IRequest<int>
	{
		public Guid StudentsId { get; set; }
		public string Value { get; set; }
		public DateTime? PaymentDate { get; set; }
	}

	public class CreatePaymentCommandHandler : IRequestHandler<CreatePaymentCommand, int>
	{
		private readonly ApplicationDbContext _context;

		public CreatePaymentCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<int> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
		{
			// Проверяем существование студента
			var studentExists = await _context.Students
				.AnyAsync(s => s.Id == request.StudentsId, cancellationToken);

			if (!studentExists)
				throw new Exception($"Студент с ID {request.StudentsId} не найден");

			var payment = new Payment
			{
				StudentsId = request.StudentsId,
				Value = request.Value,
				PaymentDate = request.PaymentDate ?? DateTime.UtcNow,
				CreatedAt = DateTime.UtcNow
			};

			_context.Payments.Add(payment);
			await _context.SaveChangesAsync(cancellationToken);

			return payment.Id;
		}
	}
}