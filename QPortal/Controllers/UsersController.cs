using AutoMapper;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QPortal.Data;
using QPortal.Helpers;
using QPortal.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace QPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IMapper _mapper;

        public UsersController(MyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Route("uploadcsv")]
        [HttpPost]
        public async Task<ActionResult> PostCsv()
        {
            var file = Request.Form.Files.FirstOrDefault();

            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                using (var csv = new CsvReader(reader, CultureInfo.GetCultureInfo("en-IN")))
                {
                    var records = csv.GetRecords<User>();

                    foreach (var user in records)
                    {
                        user.UserId = Guid.NewGuid().ToString();
                        user.Password = PasswordHash.HashPassword(user.Password);
                        _context.Users.Add(user);

                        try
                        {
                            await _context.SaveChangesAsync();
                        }
                        catch (DbUpdateException e)
                        {
                            // Accumulate errors to show later
                            continue;
                        }
                    }
                }
            }

            return new OkResult();
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<List<UserResponse>>> GetUsers()
        {
            List<User> users;
            users = await _context.Users.ToListAsync();
            return _mapper.Map<List<UserResponse>>(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.UserId = Guid.NewGuid().ToString();
            user.Password = PasswordHash.HashPassword(user.Password);
            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                if (UserExists(user.UserName))
                {
                    return Conflict();
                }
                else
                {
                    throw e;
                }
            }

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool UserExists(string userName)
        {
            return _context.Users.Any(e => e.UserName == userName);
        }
    }
}
