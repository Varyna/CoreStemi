using Stemi.WebAPI.Exceptions;

namespace Stemi.WebAPI.Middleware
{
	public class ExceptionHandlingMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly ILogger<ExceptionHandlingMiddleware> _logger;

		public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
		{
			_next = next;
			_logger = logger;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			try
			{
				await _next(context);
			}
			catch (NotFoundException ex)
			{
				_logger.LogWarning(ex, "Ресурс не найден. Path: {Path}", context.Request.Path);
				context.Response.StatusCode = 404;
				await context.Response.WriteAsJsonAsync(new { error = ex.Message });
			}
			catch (BadRequestException ex)
			{
				_logger.LogWarning(ex, "Некорректный запрос. Path: {Path}", context.Request.Path);
				context.Response.StatusCode = 400;
				await context.Response.WriteAsJsonAsync(new { error = ex.Message });
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Непредвиденная ошибка. Path: {Path}, Method: {Method}",
					context.Request.Path, context.Request.Method);
				context.Response.StatusCode = 500;
				await context.Response.WriteAsJsonAsync(new { error = "Внутренняя ошибка сервера" });
			}
		}
	}
}
