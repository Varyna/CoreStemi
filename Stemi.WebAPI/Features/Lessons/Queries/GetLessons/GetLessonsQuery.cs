using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Lessons.Queries.GetLessons
{
	public class GetLessonsQuery : IRequest<List<LessonDto>> { }

	public class GetLessonsQueryHandler : IRequestHandler<GetLessonsQuery, List<LessonDto>>
	{
		private readonly ApplicationDbContext _context;

		public GetLessonsQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<List<LessonDto>> Handle(GetLessonsQuery request, CancellationToken cancellationToken)
		{
			return await _context.Lessons
				.Include(l => l.DirectoryGroup)
				.Include(l => l.DirectoryTime)
				.Include(l => l.DirectoryCabinets)
				.Select(l => new LessonDto
				{
					Id = l.Id,
					Subject = l.Subject,
					Teacher = l.Teacher,
					DirectoryGroupsId = l.DirectoryGroupsId,
					GroupName = l.DirectoryGroup.Name,
					DirectoryTimeId = l.DirectoryTimeId,
					TimeName = l.DirectoryTime.Name,
					NumberLecture = l.NumberLecture,
					Date = l.Date,
					DirectoryCabinetsId = l.DirectoryCabinetsId,
					CabinetName = l.DirectoryCabinets.Name
				})
				.ToListAsync(cancellationToken);
		}
	}
}
