using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Features.Users.Models;

namespace Stemi.WebAPI.Features.Users.Queries
{
	public class GetAllUsersQuery : IRequest<UserListResponse>
	{
		// Можно добавить пагинацию, фильтры и т.д.
	}

	public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, UserListResponse>
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		private readonly ILogger<GetAllUsersQueryHandler> _logger;

		public GetAllUsersQueryHandler(ApplicationDbContext context, IMapper mapper, ILogger<GetAllUsersQueryHandler> logger)
		{
			_context = context;
			_mapper = mapper;
			_logger = logger;
		}

		public async Task<UserListResponse> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
		{
			_logger.LogDebug("Начало обработки запроса GetAllUsersQuery");

			var users = await _context.Users
				.OrderBy(u => u.UserName)
				.ToListAsync(cancellationToken);

			_logger.LogDebug("Получено {Count} пользователей из базы данных", users.Count);

			var userResponses = _mapper.Map<List<UserResponse>>(users);

			_logger.LogInformation("Запрос GetAllUsersQuery успешно обработан. Возвращено {Count} пользователей",
				userResponses.Count);

			return new UserListResponse
			{
				Users = userResponses,
				TotalCount = userResponses.Count
			};
		}
	}
}
