using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QPortal.Data;
using QPortal.Helpers;
using QPortal.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private IConfiguration _config;
        private readonly MyDbContext _dbContext;

        public LoginController(IConfiguration config, MyDbContext context)
        {
            _config = config;
            _dbContext = context;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] Login login)
        {
            IActionResult response = Unauthorized("Invalid Email and Password.Please retry");
            var user = AuthenticateUser(login);

            if (user != null)
            {
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        private string GenerateJSONWebToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userInfo.FirstName + userInfo.LastName),
                new Claim(ClaimTypes.Email, userInfo.UserName),
                new Claim(ClaimTypes.Role, userInfo.UserRole.ToString()),
                new Claim(ClaimTypes.StreetAddress, userInfo.Address),
                new Claim(ClaimTypes.DateOfBirth, userInfo.DOB.ToShortDateString())
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return tokenHandler.WriteToken(token);
        }

        private User AuthenticateUser(Login login)
        {
            var passHash = PasswordHash.HashPassword(login.Password);
            User user = _dbContext.Users.Where(u => u.UserName.Equals(login.UserName) && u.Password.Equals(passHash)).FirstOrDefault();
            return user;
        }
    }
}
