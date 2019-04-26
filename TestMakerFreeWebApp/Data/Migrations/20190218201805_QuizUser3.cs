using Microsoft.EntityFrameworkCore.Migrations;

namespace TestMakerFreeWebApp.Data.Migrations
{
    public partial class QuizUser3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LikeCount",
                table: "Quizzes",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikeCount",
                table: "Quizzes");
        }
    }
}
