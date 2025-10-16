using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Exceptions;
using Stemi.WebAPI.Features.Users.Models;

namespace Stemi.WebAPI.Features.Users.Queries
{
	public class GetUserByIdQuery : IRequest<UserResponse>
	{
		public string UserId { get; set; } = string.Empty;
	}

	public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserResponse>
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;

		public GetUserByIdQueryHandler(ApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		public async Task<UserResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
		{
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

			if (user == null)
				throw new NotFoundException($"Пользователь с ID {request.UserId} не найден");

			return _mapper.Map<UserResponse>(user);
		}
	}
}
