using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Stemi.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class updateTableLessonsCorpus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Corpus",
                table: "Lessons",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Corpus",
                table: "Lessons");
        }
    }
}
