using MediatR;
using Microsoft.EntityFrameworkCore;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.DTOs;

namespace Stemi.WebAPI.Features.Students.Queries.GetStudentById
{
	public class GetStudentByIdQuery : IRequest<StudentDetailDto>
	{
		public Guid Id { get; set; }
	}

	public class GetStudentByIdQueryHandler : IRequestHandler<GetStudentByIdQuery, StudentDetailDto>
	{
		private readonly ApplicationDbContext _context;

		public GetStudentByIdQueryHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<StudentDetailDto> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
		{
			var student = await _context.Students
				.Include(s => s.Sessions)
				.Include(s => s.Payments)
				.Where(s => s.Id == request.Id)
				.Select(s => new StudentDetailDto
				{
					Id = s.Id,
					UserId = s.UserId,
					NameStudent = s.NameStudent,
					ConditionsOfEducation = s.ConditionsOfEducation,
					StudentGroup = s.StudentGroup,
					Direction = s.Direction,
					Profile = s.Profile,
					NoOffsetBook = s.NoOffsetBook,
					TheLevelOfEducation = s.TheLevelOfEducation,
					LearningForms = s.LearningForms,
					YearOfReceipt = s.YearOfReceipt,
					PassportID = s.PassportID,
					IssuedBy = s.IssuedBy,
					DateOfIssue = s.DateOfIssue,
					Citizenship = s.Citizenship,
					DateOfBirth = s.DateOfBirth,
					PlaceOfBirth = s.PlaceOfBirth,
					Floor = s.Floor,
					StudentPrivileges = s.StudentPrivileges,
					DocumentType = s.DocumentType,
					SeriesAndNumber = s.SeriesAndNumber,
					PrivilegesDateOfIssue = s.PrivilegesDateOfIssue,
					Learninglanguage = s.Learninglanguage,
					Differences = s.Differences,
					TitleDifferences = s.TitleDifferences,
					YearOfEnding = s.YearOfEnding,
					WhereIsTheUltrasound = s.WhereIsTheUltrasound,
					SecondHigher = s.SecondHigher,
					Specialty = s.Specialty,
					DateOfEnrollment = s.DateOfEnrollment,
					OrderNo = s.OrderNo,
					TheDepartment = s.TheDepartment,
					Supervisor = s.Supervisor,
					ExpirationDate = s.ExpirationDate,
					StudentPhone = s.StudentPhone,
					Hostel = s.Hostel,
					DormitoryRoom = s.DormitoryRoom,
					IndexPlace = s.IndexPlace,
					PlaceOfResidence = s.PlaceOfResidence,
					DraftBoard = s.DraftBoard,
					AttributedCertificate = s.AttributedCertificate,
					MilitarySpecialty = s.MilitarySpecialty,
					MilitaryRank = s.MilitaryRank,
					MilitaryID = s.MilitaryID,
					TIN = s.TIN,
					MilitaryDepartment = s.MilitaryDepartment,
					SocialInsuranceNo = s.SocialInsuranceNo,
					DateCredited = s.DateCredited,
					OrderOfAdmission = s.OrderOfAdmission,
					SNILS = s.SNILS,
					INNOld = s.INNOld,
					ConditionalTranslation = s.ConditionalTranslation,
					Email = s.Email,
					FormerLastName = s.FormerLastName,
					ExpectedRelease = s.ExpectedRelease,
					Payment = s.Payment,
					Sessions = s.Sessions.Select(se => new SessionDto
					{
						Id = se.Id,
						ControlType = se.ControlType,
						SessionCourse = se.SessionCourse,
						SessionName = se.SessionName,
						SessionYear = se.SessionYear,
						Subject = se.Subject,
						NameStudents = se.NameStudents,
						Score = se.Score,
						Relevance = se.Relevance,
						StudentsId = se.StudentsId,
						Group = se.Group,
						CreatedAt = se.CreatedAt
					}).ToList(),
					Payments = s.Payments.Select(p => new PaymentDto
					{
						Id = p.Id,
						StudentsId = p.StudentsId,
						Value = p.Value,
						CreatedAt = p.CreatedAt,
						PaymentDate = p.PaymentDate
					}).ToList(),
					CreatedAt = s.CreatedAt,
					UpdatedAt = s.UpdatedAt
				})
				.FirstOrDefaultAsync(cancellationToken);

			return student;
		}
	}
}
