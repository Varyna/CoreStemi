using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Stemi.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class createDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DirectoryCabinets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectoryCabinets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DirectoryGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Corpus = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectoryGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DirectoryTimes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectoryTimes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    NameStudent = table.Column<string>(type: "text", nullable: true),
                    ConditionsOfEducation = table.Column<string>(type: "text", nullable: true),
                    StudentGroup = table.Column<string>(type: "text", nullable: true),
                    Direction = table.Column<string>(type: "text", nullable: true),
                    Profile = table.Column<string>(type: "text", nullable: true),
                    NoOffsetBook = table.Column<string>(type: "text", nullable: true),
                    TheLevelOfEducation = table.Column<string>(type: "text", nullable: true),
                    LearningForms = table.Column<string>(type: "text", nullable: true),
                    YearOfReceipt = table.Column<string>(type: "text", nullable: true),
                    PassportID = table.Column<string>(type: "text", nullable: true),
                    IssuedBy = table.Column<string>(type: "text", nullable: true),
                    DateOfIssue = table.Column<string>(type: "text", nullable: true),
                    Citizenship = table.Column<string>(type: "text", nullable: true),
                    DateOfBirth = table.Column<string>(type: "text", nullable: true),
                    PlaceOfBirth = table.Column<string>(type: "text", nullable: true),
                    Floor = table.Column<string>(type: "text", nullable: true),
                    StudentPrivileges = table.Column<string>(type: "text", nullable: true),
                    DocumentType = table.Column<string>(type: "text", nullable: true),
                    SeriesAndNumber = table.Column<string>(type: "text", nullable: true),
                    PrivilegesDateOfIssue = table.Column<string>(type: "text", nullable: true),
                    Learninglanguage = table.Column<string>(type: "text", nullable: true),
                    Differences = table.Column<string>(type: "text", nullable: true),
                    TitleDifferences = table.Column<string>(type: "text", nullable: true),
                    YearOfEnding = table.Column<string>(type: "text", nullable: true),
                    WhereIsTheUltrasound = table.Column<string>(type: "text", nullable: true),
                    SecondHigher = table.Column<string>(type: "text", nullable: true),
                    Specialty = table.Column<string>(type: "text", nullable: true),
                    DateOfEnrollment = table.Column<string>(type: "text", nullable: true),
                    OrderNo = table.Column<string>(type: "text", nullable: true),
                    TheDepartment = table.Column<string>(type: "text", nullable: true),
                    Supervisor = table.Column<string>(type: "text", nullable: true),
                    ExpirationDate = table.Column<string>(type: "text", nullable: true),
                    StudentPhone = table.Column<string>(type: "text", nullable: true),
                    Hostel = table.Column<string>(type: "text", nullable: true),
                    DormitoryRoom = table.Column<string>(type: "text", nullable: true),
                    IndexPlace = table.Column<string>(type: "text", nullable: true),
                    PlaceOfResidence = table.Column<string>(type: "text", nullable: true),
                    DraftBoard = table.Column<string>(type: "text", nullable: true),
                    AttributedCertificate = table.Column<string>(type: "text", nullable: true),
                    MilitarySpecialty = table.Column<string>(type: "text", nullable: true),
                    MilitaryRank = table.Column<string>(type: "text", nullable: true),
                    MilitaryID = table.Column<string>(type: "text", nullable: true),
                    TIN = table.Column<string>(type: "text", nullable: true),
                    MilitaryDepartment = table.Column<string>(type: "text", nullable: true),
                    SocialInsuranceNo = table.Column<string>(type: "text", nullable: true),
                    DateCredited = table.Column<string>(type: "text", nullable: true),
                    OrderOfAdmission = table.Column<string>(type: "text", nullable: true),
                    SNILS = table.Column<string>(type: "text", nullable: true),
                    INNOld = table.Column<string>(type: "text", nullable: true),
                    ConditionalTranslation = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    FormerLastName = table.Column<string>(type: "text", nullable: true),
                    ExpectedRelease = table.Column<string>(type: "text", nullable: true),
                    Payment = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Roles = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Subject = table.Column<string>(type: "text", nullable: false),
                    Teacher = table.Column<string>(type: "text", nullable: false),
                    DirectoryGroupsId = table.Column<int>(type: "integer", nullable: false),
                    DirectoryTimeId = table.Column<int>(type: "integer", nullable: false),
                    NumberLecture = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DirectoryCabinetsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_DirectoryCabinets_DirectoryCabinetsId",
                        column: x => x.DirectoryCabinetsId,
                        principalTable: "DirectoryCabinets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lessons_DirectoryGroups_DirectoryGroupsId",
                        column: x => x.DirectoryGroupsId,
                        principalTable: "DirectoryGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lessons_DirectoryTimes_DirectoryTimeId",
                        column: x => x.DirectoryTimeId,
                        principalTable: "DirectoryTimes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentsId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Students_StudentsId",
                        column: x => x.StudentsId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ControlType = table.Column<string>(type: "text", nullable: true),
                    SessionCourse = table.Column<int>(type: "integer", nullable: true),
                    SessionName = table.Column<string>(type: "text", nullable: true),
                    SessionYear = table.Column<string>(type: "text", nullable: true),
                    Subject = table.Column<string>(type: "text", nullable: true),
                    NameStudents = table.Column<string>(type: "text", nullable: true),
                    Score = table.Column<string>(type: "text", nullable: true),
                    Relevance = table.Column<int>(type: "integer", nullable: false),
                    StudentsId = table.Column<Guid>(type: "uuid", nullable: false),
                    Group = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sessions_Students_StudentsId",
                        column: x => x.StudentsId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_DirectoryCabinetsId",
                table: "Lessons",
                column: "DirectoryCabinetsId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_DirectoryGroupsId",
                table: "Lessons",
                column: "DirectoryGroupsId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_DirectoryTimeId",
                table: "Lessons",
                column: "DirectoryTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PaymentDate",
                table: "Payments",
                column: "PaymentDate");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_StudentsId",
                table: "Payments",
                column: "StudentsId");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_Group",
                table: "Sessions",
                column: "Group");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_SessionYear",
                table: "Sessions",
                column: "SessionYear");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_StudentsId",
                table: "Sessions",
                column: "StudentsId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_Email",
                table: "Students",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_StudentGroup",
                table: "Students",
                column: "StudentGroup");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Sessions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "DirectoryCabinets");

            migrationBuilder.DropTable(
                name: "DirectoryGroups");

            migrationBuilder.DropTable(
                name: "DirectoryTimes");

            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
