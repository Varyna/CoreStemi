using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Features.Users.Commands;
using Stemi.WebAPI.Mapping;
using Stemi.WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
	options.UseNpgsql(connectionString));

// Add MediatR
builder.Services.AddMediatR(cfg =>
	cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Add CORS
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
	{
		policy.WithOrigins(
			"http://localhost:4200",
			"https://localhost:4200",
			"http://127.0.0.1:4200",
			"https://127.0.0.1:4200"
		)
		.AllowAnyHeader()
		.AllowAnyMethod()
		.AllowCredentials();
	});

	options.AddPolicy("AllowAll", policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

builder.Services.AddScoped<IExcelParserService, ExcelParserService>();
builder.Services.AddScoped<ILessonImportService, LessonImportService>();
builder.Services.AddScoped<ImportUsersFromExcelCommandHandler>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddAutoMapper(cfg =>
{
	cfg.AddProfile<UserProfile>();
	// Добавьте другие профили по мере необходимости
	// cfg.AddProfile<OtherProfile>();
}, typeof(Program).Assembly);
var app = builder.Build();
app.UseCors();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
