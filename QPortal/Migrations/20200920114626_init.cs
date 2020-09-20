using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QPortal.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 100, nullable: true),
                    LastName = table.Column<string>(maxLength: 100, nullable: true),
                    Password = table.Column<string>(nullable: false),
                    IsAdmin = table.Column<bool>(nullable: false),
                    Address = table.Column<string>(maxLength: 300, nullable: true),
                    DOB = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Address", "DOB", "FirstName", "IsAdmin", "LastName", "Password", "UserName" },
                values: new object[] { "1fba1c51-37b0-4d50-bb55-d130b760a9eb", "Sample Address", new DateTime(1996, 5, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Admin", true, "Pratik", "iuNPEpqhznXXsij39xAcoQ==", "admin@portal.com" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
