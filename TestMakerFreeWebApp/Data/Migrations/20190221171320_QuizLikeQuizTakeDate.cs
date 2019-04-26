using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestMakerFreeWebApp.Data.Migrations
{
    public partial class QuizLikeQuizTakeDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "QuizzesTaken",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "QuizzesLiked",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "QuizzesTaken");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "QuizzesLiked");
        }
    }
}
