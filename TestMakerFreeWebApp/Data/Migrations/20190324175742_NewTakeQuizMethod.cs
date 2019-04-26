using Microsoft.EntityFrameworkCore.Migrations;

namespace TestMakerFreeWebApp.Data.Migrations
{
    public partial class NewTakeQuizMethod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxValue",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "MinValue",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "Text",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "Answers");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Results",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Published",
                table: "Quizzes",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RelatedResultId",
                table: "Answers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Answers_RelatedResultId",
                table: "Answers",
                column: "RelatedResultId");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Results_RelatedResultId",
                table: "Answers",
                column: "RelatedResultId",
                principalTable: "Results",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Results_RelatedResultId",
                table: "Answers");

            migrationBuilder.DropIndex(
                name: "IX_Answers_RelatedResultId",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "Published",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "RelatedResultId",
                table: "Answers");

            migrationBuilder.AddColumn<int>(
                name: "MaxValue",
                table: "Results",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinValue",
                table: "Results",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "Quizzes",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Value",
                table: "Answers",
                nullable: false,
                defaultValue: 0);
        }
    }
}
