using MediatR;
using Stemi.WebAPI.Data;
using Stemi.WebAPI.Models.Entities;

namespace Stemi.WebAPI.Features.Students.Commands
{
	public class CreateStudentCommand : IRequest<Guid> 
	{
		public Guid UserId { get; set; }
		public string? NameStudent { get; set; }
		public string? ConditionsOfEducation { get; set; }
		public string? StudentGroup { get; set; }
		public string? Direction { get; set; }
		public string? Profile { get; set; }
		public string? NoOffsetBook { get; set; }
		public string? TheLevelOfEducation { get; set; }
		public string? LearningForms { get; set; }
		public string? YearOfReceipt { get; set; }
		public string? PassportID { get; set; }
		public string? IssuedBy { get; set; }
		public string? DateOfIssue { get; set; }
		public string? Citizenship { get; set; }
		public string? DateOfBirth { get; set; }
		public string? PlaceOfBirth { get; set; }
		public string? Floor { get; set; }
		public string? StudentPrivileges { get; set; }
		public string? DocumentType { get; set; }
		public string? SeriesAndNumber { get; set; }
		public string? PrivilegesDateOfIssue { get; set; }
		public string? Learninglanguage { get; set; }
		public string? Differences { get; set; }
		public string? TitleDifferences { get; set; }
		public string? YearOfEnding { get; set; }
		public string? WhereIsTheUltrasound { get; set; }
		public string? SecondHigher { get; set; }
		public string? Specialty { get; set; }
		public string? DateOfEnrollment { get; set; }
		public string? OrderNo { get; set; }
		public string? TheDepartment { get; set; }
		public string? Supervisor { get; set; }
		public string? ExpirationDate { get; set; }
		public string? StudentPhone { get; set; }
		public string? Hostel { get; set; }
		public string? DormitoryRoom { get; set; }
		public string? IndexPlace { get; set; }
		public string? PlaceOfResidence { get; set; }
		public string? DraftBoard { get; set; }
		public string? AttributedCertificate { get; set; }
		public string? MilitarySpecialty { get; set; }
		public string? MilitaryRank { get; set; }
		public string? MilitaryID { get; set; }
		public string? TIN { get; set; }
		public string? MilitaryDepartment { get; set; }
		public string? SocialInsuranceNo { get; set; }
		public string? DateCredited { get; set; }
		public string? OrderOfAdmission { get; set; }
		public string? SNILS { get; set; }
		public string? INNOld { get; set; }
		public string? ConditionalTranslation { get; set; }
		public string? Email { get; set; }
		public string? FormerLastName { get; set; }
		public string? ExpectedRelease { get; set; }
		public string? Payment { get; set; }
	}

	public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, Guid>
	{
		private readonly ApplicationDbContext _context;

		public CreateStudentCommandHandler(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<Guid> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
		{
			var student = new Student
			{
				Id = Guid.NewGuid(),
				UserId = request.UserId,
				NameStudent = request.NameStudent,
				ConditionsOfEducation = request.ConditionsOfEducation,
				StudentGroup = request.StudentGroup,
				Direction = request.Direction,
				Profile = request.Profile,
				NoOffsetBook = request.NoOffsetBook,
				TheLevelOfEducation = request.TheLevelOfEducation,
				LearningForms = request.LearningForms,
				YearOfReceipt = request.YearOfReceipt,
				PassportID = request.PassportID,
				IssuedBy = request.IssuedBy,
				DateOfIssue = request.DateOfIssue,
				Citizenship = request.Citizenship,
				DateOfBirth = request.DateOfBirth,
				PlaceOfBirth = request.PlaceOfBirth,
				Floor = request.Floor,
				StudentPrivileges = request.StudentPrivileges,
				DocumentType = request.DocumentType,
				SeriesAndNumber = request.SeriesAndNumber,
				PrivilegesDateOfIssue = request.PrivilegesDateOfIssue,
				Learninglanguage = request.Learninglanguage,
				Differences = request.Differences,
				TitleDifferences = request.TitleDifferences,
				YearOfEnding = request.YearOfEnding,
				WhereIsTheUltrasound = request.WhereIsTheUltrasound,
				SecondHigher = request.SecondHigher,
				Specialty = request.Specialty,
				DateOfEnrollment = request.DateOfEnrollment,
				OrderNo = request.OrderNo,
				TheDepartment = request.TheDepartment,
				Supervisor = request.Supervisor,
				ExpirationDate = request.ExpirationDate,
				StudentPhone = request.StudentPhone,
				Hostel = request.Hostel,
				DormitoryRoom = request.DormitoryRoom,
				IndexPlace = request.IndexPlace,
				PlaceOfResidence = request.PlaceOfResidence,
				DraftBoard = request.DraftBoard,
				AttributedCertificate = request.AttributedCertificate,
				MilitarySpecialty = request.MilitarySpecialty,
				MilitaryRank = request.MilitaryRank,
				MilitaryID = request.MilitaryID,
				TIN = request.TIN,
				MilitaryDepartment = request.MilitaryDepartment,
				SocialInsuranceNo = request.SocialInsuranceNo,
				DateCredited = request.DateCredited,
				OrderOfAdmission = request.OrderOfAdmission,
				SNILS = request.SNILS,
				INNOld = request.INNOld,
				ConditionalTranslation = request.ConditionalTranslation,
				Email = request.Email,
				FormerLastName = request.FormerLastName,
				ExpectedRelease = request.ExpectedRelease,
				Payment = request.Payment,
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow
			};

			_context.Students.Add(student);
			await _context.SaveChangesAsync(cancellationToken);

			return student.Id;
		}
	}
}
