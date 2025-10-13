using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Sessions.Queries.GetSessionById
{
	public class GetSessionByIdQuery : IRequest<SessionDto>
	{
		public int Id { get; set; }
	}

	public class GetSessionByIdQueryHandler : IRequestHandler<GetSessionByIdQuery, SessionDto>
	{
		private readonly ApplicationDbContext _context;

		public GetSessionByIdQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<SessionDto> Handle(GetSessionByIdQuery request, CancellationToken cancellationToken)
		{
			var session = await _context.Sessions
				.Where(s => s.Id == request.Id)
				.Select(s => new SessionDto
				{
					Id = s.Id,
					ControlType = s.ControlType,
					SessionCourse = s.SessionCourse,
					SessionName = s.SessionName,
					SessionYear = s.SessionYear,
					Subject = s.Subject,
					NameStudents = s.NameStudents,
					Score = s.Score,
					Relevance = s.Relevance,
					StudentsId = s.StudentsId,
					Group = s.Group,
					CreatedAt = s.CreatedAt
				})
				.FirstOrDefaultAsync(cancellationToken);

			return session;
		}
	}
}

