using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestMakerFreeWebApp.Data;
using TestMakerFreeWebApp.Data.Models;
using TestMakerFreeWebApp.ViewModels;

namespace TestMakerFreeWebApp.Controllers
{
    public class ResultController : BaseApiController
    {
        #region Constructor
        public ResultController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
            : base(context, roleManager, userManager, configuration) { }
        #endregion

        #region RESTful conventions methods
        /// <summary>
        /// Retrieves the Result with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Result</param>
        /// <returns>the Result with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var result = DbContext.Results.Where(r => r.Id == id).FirstOrDefault();

            // handle requests asking for non-existing results
            if (result == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Result ID {0} has not been found", id)
                });
            }

            return new JsonResult(result.Adapt<ResultViewModel>());
        }

        /// <summary>
        /// Adds a new Result to the Database
        /// </summary>
        /// <param name="m">The ResultViewModel containing the data to insert</param>
        [HttpPut]
        [Authorize]
        public IActionResult Put([FromBody]ResultViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid
            if (model == null) return new StatusCodeResult(500);

            // retrieve the result to edit
            var result = DbContext.Results.Where(r => r.Id == model.Id)
                .FirstOrDefault();

            // handle requests asking for non-existing results
            if (result == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Result ID {0} has not been found", model.Id)
                });
            }

            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            result.QuizId = model.QuizId;
            result.Text = model.Text;
            result.Priority = model.Priority;
            result.Notes = model.Notes;

            // properties set from server-side
            result.LastModifiedDate = DateTime.Now;

            // persist the changes into the Database
            DbContext.SaveChanges();

            // return the updated Quiz to the client.
            return new JsonResult(result.Adapt<ResultViewModel>());
        }

        /// <summary>
        /// Edit the Result with the given {id}
        /// </summary>
        /// <param name="m">The ResultViewModel containing the data to update</param>
        [HttpPost]
        [Authorize]
        public IActionResult Post([FromBody]ResultViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);

            // map the ViewModel to the Model
            var result = model.Adapt<Result>();

            // override those properties that
            // should be set from the server-side only
            result.CreatedDate = DateTime.Now;
            result.LastModifiedDate = result.CreatedDate;
            result.Priority = DbContext.Results
                .Where(r => r.QuizId == model.QuizId).Count() + 1;

            // add the new result
            DbContext.Results.Add(result);

            // persist the changes into the database
            DbContext.SaveChanges();

            // return the newly-created result to the client.
            return new JsonResult(result.Adapt<ResultViewModel>());
        }

        /// <summary>
        /// Deletes the Result with the given {id} from the Database
        /// </summary>
        /// <param name="id">The ID of an existing Result</param>
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            // retrieve the result from the database
            var result = DbContext.Results.Where(r => r.Id == id).FirstOrDefault();

            // handle requests asking for non-existing results
            if (result == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Result ID {0} has not been found", id)
                });
            }

            // remove the quiz from the DbContext
            DbContext.Results.Remove(result);

            // persist the changes into the database
            DbContext.SaveChanges();

            // return an HTTP Status 200 (OK)
            return new OkResult();
        }

        #endregion

        #region Attribute-based routing methods
        /// <summary>
        /// GET: api/result/all/{quizId}
        /// Get all the results with the quiz id {quizId}
        /// </summary>
        /// <param name="quizId">ID of the quiz</param>
        /// <returns>The results of the requested quiz</returns>
        [HttpGet("All/{quizId}")]
        public IActionResult All(int quizId)
        {
            var results = DbContext.Results
                .Where(r => r.QuizId == quizId)
                .ToArray();

            return new JsonResult(results.Adapt<ResultViewModel[]>());
        }

        [HttpPut("Priority")]
        [Authorize]
        public IActionResult ChangePriority([FromBody]ResultViewModel model)
        {
            var userId = UserManager.GetUserId(User);
            var results = DbContext.Results.Where(r => r.QuizId == model.QuizId).ToList();
            var result = results.Find(r => r.Id == model.Id);
            var quiz = DbContext.Quizzes.Where(q => q.Id == result.QuizId).FirstOrDefault();

            if (quiz == null || quiz.UserId != userId)
            {
                return new StatusCodeResult(500);
            }

            var oldPr = result.Priority;
            var newPr = model.Priority;

            results.Remove(result);
            results.Insert(newPr - 1, result);

            var priority = 1;
            results.ForEach(r =>
            {
                r.Priority = priority++;
            });

            DbContext.SaveChanges();

            return new JsonResult(results.Adapt<ResultViewModel[]>());
        }
        #endregion

        #region Helper methods
        /// <summary>
        /// Gets a list of results and updates each priority
        /// </summary>
        private void ChangePriority(List<Result> results, int oldPriority, int newPriority)
        {
            results = results.OrderBy(r => r.Priority).ToList();
            var result = results.Find(r => r.Priority == oldPriority);

            if (result == null) return;

            results.Remove(result);
            results.Insert(newPriority - 1, result);

            int priority = 1;
            results.ForEach(r =>
            {
                r.Priority = priority++;
            });
        }
        #endregion
    }
}
