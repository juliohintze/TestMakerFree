using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TestMakerFreeWebApp.Data;
using TestMakerFreeWebApp.Data.Models;
using TestMakerFreeWebApp.ViewModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestMakerFreeWebApp.Controllers
{
    public class TokenController : BaseApiController
    {
        #region Private Member
        #endregion

        #region Constructor
        public TokenController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
            : base(context, roleManager, userManager, configuration) { }
        #endregion

        [HttpPost("Auth")]
        public async Task<IActionResult>
            Jwt([FromBody]TokenRequestViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid
            if (model == null) return new StatusCodeResult(500);

            switch(model.grant_type)
            {
                case "password":
                    return await GetToken(model);
                case "refresh_token":
                    return await RefreshToken(model);
                default:
                    // not supported - return a HTTP 401 (Unauthorized)
                    return new UnauthorizedResult();
            }
        }

        private async Task<IActionResult>
            GetToken(TokenRequestViewModel model)
        {
            try
            {
                // check if there's an user with the given username
                var user = await UserManager.FindByNameAsync(model.username);

                // fallback to support e-mail address instead of username
                if (user == null && model.username.Contains("@"))
                    user = await UserManager.FindByEmailAsync(model.username);

                if (user == null || !await UserManager.CheckPasswordAsync(user,
                    model.password))
                {
                    // user does not exists or password mismatch
                    return new UnauthorizedResult();
                }

                // get user roles
                List<string> roles = (await UserManager.GetRolesAsync(user)).ToList();

                // username & password matches: create and return Jwt token
                var rt = CreateRefreshToken(model.client_id, user.Id);

                // add the new refresh token to the DB
                DbContext.Tokens.Add(rt);
                DbContext.SaveChanges();

                // create and return the access token
                var t = CreateAccessToken(user.Id, user.Email, roles, rt.Value);
                return Json(t);
            }
            catch (Exception)
            {
                return new UnauthorizedResult();
            }
        }

        private async Task<IActionResult>
            RefreshToken(TokenRequestViewModel model)
        {
            try
            {
                // check if the received refreshToken exists for the given clientId
                var rt = DbContext.Tokens
                        .Where(t => t.ClientId == model.client_id && t.Value == model.refresh_token)
                        .FirstOrDefault();

                // refresh token not found or invalid (or invalid clientId)
                if (rt == null) return new UnauthorizedResult();

                // check if there's an user with the refresh token's userId
                var user = await UserManager.FindByIdAsync(rt.UserId);

                // UserId not found or invalid
                if (user == null) return new UnauthorizedResult();

                // generate a new refresh token
                var rtNew = CreateRefreshToken(rt.ClientId, rt.UserId);

                // invalidate the old refresh token (by deleting it);
                DbContext.Tokens.Remove(rt);

                // add the new refresh token
                DbContext.Tokens.Add(rtNew);

                // persist changes in the DB
                DbContext.SaveChanges();

                // get user roles

                List<string> roles = (await UserManager.GetRolesAsync(user)).ToList();

                var response = CreateAccessToken(rtNew.UserId, user.Email, roles, rtNew.Value);

                // ... and send it to the client
                return Json(response);
            }
            catch(Exception)
            {
                return new UnauthorizedResult();
            }
        }

        private Token CreateRefreshToken(string clientId, string userId)
        {
            return new Token()
            {
                ClientId = clientId,
                UserId = userId,
                Type = 0,
                Value = Guid.NewGuid().ToString("N"),
                CreatedDate = DateTime.UtcNow
            };
        }

        private TokenResponseViewModel CreateAccessToken(string userId, string email, List<string> roles, string refreshToken)
        {
            DateTime now = DateTime.UtcNow;
            var claims = new List<Claim>();

            claims.Add(new Claim(JwtRegisteredClaimNames.Sub, userId));
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString()));
            claims.Add(new Claim(ClaimTypes.Email, email));

            roles.ForEach(r =>
            {
                claims.Add(new Claim(ClaimTypes.Role, r));
            });

            var tokenExpirationMins = Configuration
                .GetValue<int>("Auth:Jwt:TokenExpirationInMinutes");

            var issuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Configuration["Auth:Jwt:Key"]));

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: Configuration["Auth:Jwt:Issuer"],
                audience: Configuration["Auth:Jwt:Audience"],
                claims: claims,
                notBefore: now,
                expires: now.Add(TimeSpan.FromMinutes(tokenExpirationMins)),
                signingCredentials: new SigningCredentials(issuerSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);
            return new TokenResponseViewModel()
            {
                token = encodedToken,
                expiration = tokenExpirationMins,
                refresh_token = refreshToken
            };
        }
    }
}
