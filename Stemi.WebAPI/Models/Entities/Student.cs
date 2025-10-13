using NPOI.POIFS.Properties;
using System.ComponentModel.DataAnnotations;

namespace Stemi.WebAPI.Models.Entities
{
	public class Student
	{
		[Key]
		public Guid Id { get; set; }
		public Guid UserId { get; set; }
		public virtual List<Session> Sessions { get; set; } = new();
		public virtual List<Payment> Payments { get; set; } = new();
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
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
	}
}
