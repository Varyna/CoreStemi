using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Payments.Queries.GetPaymentById
{
	public class GetPaymentByIdQuery : IRequest<PaymentDto>
	{
		public int Id { get; set; }
	}

	public class GetPaymentByIdQueryHandler : IRequestHandler<GetPaymentByIdQuery, PaymentDto>
	{
		private readonly ApplicationDbContext _context;

		public GetPaymentByIdQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<PaymentDto> Handle(GetPaymentByIdQuery request, CancellationToken cancellationToken)
		{
			var payment = await _context.Payments
				.Where(p => p.Id == request.Id)
				.Select(p => new PaymentDto
				{
					Id = p.Id,
					StudentsId = p.StudentsId,
					Value = p.Value,
					CreatedAt = p.CreatedAt,
					PaymentDate = p.PaymentDate
				})
				.FirstOrDefaultAsync(cancellationToken);

			return payment;
		}
	}
}
