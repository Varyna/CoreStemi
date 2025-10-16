using AutoMapper;
using Stemi.WebAPI.Features.Users.Models;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Mapping
{
	public class UserProfile : Profile
	{
		public UserProfile()
		{
			CreateMap<User, UserResponse>()
				.ForMember(dest => dest.Status, opt => opt.MapFrom(src => "active"));
		}
	}
}
