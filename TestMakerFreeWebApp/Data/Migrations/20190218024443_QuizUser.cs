using Microsoft.EntityFrameworkCore.Migrations;

namespace TestMakerFreeWebApp.Data.Migrations
{
    public partial class QuizUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuizzesLiked",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    QuizId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizzesLiked", x => new { x.UserId, x.QuizId });
                    table.ForeignKey(
                        name: "FK_QuizzesLiked_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizzesLiked_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizzesTaken",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    QuizId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizzesTaken", x => new { x.UserId, x.QuizId });
                    table.ForeignKey(
                        name: "FK_QuizzesTaken_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizzesTaken_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizzesLiked_QuizId",
                table: "QuizzesLiked",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizzesTaken_QuizId",
                table: "QuizzesTaken",
                column: "QuizId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizzesLiked");

            migrationBuilder.DropTable(
                name: "QuizzesTaken");
        }
    }
}
