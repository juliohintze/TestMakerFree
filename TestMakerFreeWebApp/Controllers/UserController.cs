using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TestMakerFreeWebApp.ViewModels;
using System.Collections.Generic;
using System.Linq;
using TestMakerFreeWebApp.Data;
using Mapster;
using TestMakerFreeWebApp.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace TestMakerFreeWebApp.Controllers
{
    public class UserController : BaseApiController
    {
        #region Constructor
        public UserController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
            : base(context, roleManager, userManager, configuration) { }

        #endregion

        #region RESTful Conventions
        /// <summary>
        /// GET: api/user/{id}
        /// Get a user by ID
        /// </summary>
        /// <param name="id">ID of the requested user</param>
        /// <returns>The user, if found</returns>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await UserManager.FindByIdAsync(id);

            // Hangle requests asking for non-existing users
            if (user == null)
            {
                return NotFound(new
                {
                    Error = String.Format("User ID {0} has not been found", id)
                });
            }

            return new JsonResult(user.Adapt<UserViewModel>());
        }

        /// <summary>
        /// POST: api/user
        /// Creates a new User
        /// </summary>
        /// <returns>Return the created user</returns>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody]RegisterViewModel model)
        {
            // return a generic HTTP Status 500 (server error)
            // if the client payload is invalid
            if (model == null) return new StatusCodeResult(500);

            // check if the Username/Email already exists
            ApplicationUser user = await UserManager.FindByNameAsync(model.UserName);
            if (user != null) return BadRequest("Username already exists");

            user = await UserManager.FindByEmailAsync(model.Email);
            if (user != null) return BadRequest("E-mail already exists");

            var now = DateTime.Now;

            // create a new Item with the client-sent json data
            user = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName,
                Email = model.Email,
                DisplayName = model.DisplayName,
                CreatedDate = now,
                LastModifiedDate = now
            };

            // Add the user to the DB with the choosen password
            await UserManager.CreateAsync(user, model.Password);

            // Assign the user to the 'RegisteredUser' role.
            await UserManager.AddToRoleAsync(user, "RegisteredUser");

            // Remove Lockout and E-Mail confirmation
            user.EmailConfirmed = true;
            user.LockoutEnabled = false;

            // persist the changes into the Database
            DbContext.SaveChanges();

            // return the newly-created User to the client
            return Json(user.Adapt<RegisterViewModel>());
        }

        /// <summary>
        /// PUT: api/user
        /// Change the password for the current user
        /// </summary>
        /// <param name="model">The old and new password</param>
        /// <returns>Status code 200</returns>
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordViewModel model)
        {
            if (model == null || model.OldPassword == null || model.NewPassword == null)
                return new StatusCodeResult(500);

            string userId = UserManager.GetUserId(User);
            ApplicationUser user = DbContext.Users.Where(u => u.Id == userId).FirstOrDefault();

            var result = await UserManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return new StatusCodeResult(500);
            }
        }
        #endregion

        #region Attribute-based routing methods
        /// <summary>
        /// GET: api/user
        /// Search a user by e-mail or display name, case insensitive
        /// </summary>
        /// <param name="search">The user e-mail or display name</param>
        /// <param name="num">The number of results to return</param>
        /// <param name="page">The page of the search</param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public IActionResult SearchUser(string search, int num = 10, int page = 1)
        {
            int skip = (page - 1) * num;
            IQueryable<ApplicationUser> users = DbContext.Users;

            if (search != null)
                users = users.Where(u => u.Email.ToLower().Contains(search.ToLower()) || u.DisplayName.ToLower().Contains(search.ToLower()));

            int totalResults = users.Count();
            int totalPages = totalResults / num;

            if (totalResults % num != 0) totalPages++;

            users = users.OrderBy(u => u.DisplayName).Skip(skip).Take(num);

            return Json(new SearchResponseViewModel<UserViewModel>()
            {
                Results = users.ToArray().Adapt<UserViewModel[]>(),
                TotalPages = totalPages,
                TotalResults = totalResults
            });
            
        }
        #endregion
    }
}