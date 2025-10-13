using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.Entities;
using Stemi.WebAPI.Services;
using System;

namespace Stemi.WebAPI.Features.Auth.Login.Commands
{
	public record LoginCommand(string Email, string Password) : IRequest<LoginResult>;

	public class LoginResult
	{
		public bool Success { get; set; }
		public LoginResponse? Response { get; set; }
		public string ErrorMessage { get; set; } = string.Empty;

		public static LoginResult Ok(LoginResponse response) => new() { Success = true, Response = response };
		public static LoginResult Fail(string error) => new() { Success = false, ErrorMessage = error };
	}
	public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
	{
		private readonly ApplicationDbContext _context;
		private readonly IJwtService _jwtService;
		private readonly IPasswordHasher _passwordHasher;

		public LoginCommandHandler(ApplicationDbContext context, IJwtService jwtService, IPasswordHasher passwordHasher)
		{
			_context = context;
			_jwtService = jwtService;
			_passwordHasher = passwordHasher;
		}

		public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
		{
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

			if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
			{
				return LoginResult.Fail("Неверный email или пароль");
			}

			var token = _jwtService.GenerateToken(user);

			var response = new LoginResponse
			{
				Token = token,
				ExpiresIn = 3600,
				UserId = user.Id,
				UserName = user.UserName,
				Roles = user.Roles,
				Email = user.Email
			};

			return LoginResult.Ok(response);
		}
	}
}
