using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Lessons.Queries.GetLessonById
{
	public class GetLessonByIdQuery : IRequest<LessonDto>
	{
		public int Id { get; set; }
	}

	public class GetLessonByIdQueryHandler : IRequestHandler<GetLessonByIdQuery, LessonDto>
	{
		private readonly ApplicationDbContext _context;

		public GetLessonByIdQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<LessonDto> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
		{
			var lesson = await _context.Lessons
				.Include(l => l.DirectoryGroup)
				.Include(l => l.DirectoryTime)
				.Include(l => l.DirectoryCabinets)
				.Where(l => l.Id == request.Id)
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
				.FirstOrDefaultAsync(cancellationToken);

			return lesson;
		}
	}
}
