using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Payments.Queries.GetStudentPayments
{
	public class GetStudentPaymentsQuery : IRequest<List<PaymentDto>>
	{
		public Guid StudentId { get; set; }
	}

	public class GetStudentPaymentsQueryHandler : IRequestHandler<GetStudentPaymentsQuery, List<PaymentDto>>
	{
		private readonly ApplicationDbContext _context;

		public GetStudentPaymentsQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<List<PaymentDto>> Handle(GetStudentPaymentsQuery request, CancellationToken cancellationToken)
		{
			return await _context.Payments
				.Where(p => p.StudentsId == request.StudentId)
				.OrderByDescending(p => p.PaymentDate)
				.Select(p => new PaymentDto
				{
					Id = p.Id,
					StudentsId = p.StudentsId,
					Value = p.Value,
					CreatedAt = p.CreatedAt,
					PaymentDate = p.PaymentDate
				})
				.ToListAsync(cancellationToken);
		}
	}
}
