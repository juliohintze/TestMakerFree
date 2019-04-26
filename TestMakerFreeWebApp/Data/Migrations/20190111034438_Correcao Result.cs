using Microsoft.EntityFrameworkCore.Migrations;

namespace TestMakerFreeWebApp.Data.Migrations
{
    public partial class CorrecaoResult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "Results",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("Text", "Results");
        }
    }
}
