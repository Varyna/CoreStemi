using Microsoft.IdentityModel.Tokens;
using Stemi.WebAPI.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Stemi.WebAPI.Services
{
	public interface IJwtService
	{
		string GenerateToken(User user);
		string? ValidateToken(string token);
		string GetUserIdFromToken(string token);
	}
	public class JwtService : IJwtService
	{
		private readonly string _secretKey;
		private readonly string _issuer;
		private readonly string _audience;

		public JwtService(IConfiguration configuration)
		{
			_secretKey = configuration["Jwt:SecretKey"] ?? throw new ArgumentNullException("Jwt:SecretKey");
			_issuer = configuration["Jwt:Issuer"] ?? "stemi-auth";
			_audience = configuration["Jwt:Audience"] ?? "stemi-client";
		}

		public string GenerateToken(User user)
		{
			var claims = new[]
			{
			new Claim(ClaimTypes.NameIdentifier, user.Id),
			new Claim(ClaimTypes.Name, user.UserName),
			new Claim(ClaimTypes.Email, user.Email),
			new Claim("roles", string.Join(",", user.Roles.Select(r => r.ToString())))
		};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: _issuer,
				audience: _audience,
				claims: claims,
				expires: DateTime.UtcNow.AddHours(1),
				signingCredentials: creds);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		public string? ValidateToken(string token)
		{
			try
			{
				var tokenHandler = new JwtSecurityTokenHandler();
				var key = Encoding.UTF8.GetBytes(_secretKey);

				tokenHandler.ValidateToken(token, new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(key),
					ValidateIssuer = true,
					ValidIssuer = _issuer,
					ValidateAudience = true,
					ValidAudience = _audience,
					ValidateLifetime = true,
					ClockSkew = TimeSpan.Zero
				}, out _);

				return GetUserIdFromToken(token);
			}
			catch
			{
				return null;
			}
		}

		public string GetUserIdFromToken(string token)
		{
			var handler = new JwtSecurityTokenHandler();
			var jwtToken = handler.ReadJwtToken(token);
			return jwtToken.Claims.First(claim => claim.Type == ClaimTypes.NameIdentifier).Value;
		}
	}
}
