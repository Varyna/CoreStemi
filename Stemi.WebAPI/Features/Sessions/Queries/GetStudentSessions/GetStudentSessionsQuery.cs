using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Sessions.Queries.GetStudentSessions
{
	public class GetStudentSessionsQuery : IRequest<List<SessionDto>>
	{
		public Guid StudentId { get; set; }
	}

	public class GetStudentSessionsQueryHandler : IRequestHandler<GetStudentSessionsQuery, List<SessionDto>>
	{
		private readonly ApplicationDbContext _context;

		public GetStudentSessionsQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<List<SessionDto>> Handle(GetStudentSessionsQuery request, CancellationToken cancellationToken)
		{
			return await _context.Sessions
				.Where(s => s.StudentsId == request.StudentId)
				.OrderByDescending(s => s.CreatedAt)
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
				.ToListAsync(cancellationToken);
		}
	}
}
