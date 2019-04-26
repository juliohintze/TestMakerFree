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
    public class AnswerController : BaseApiController
    {
        #region Constructor
        public AnswerController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
            : base(context, roleManager, userManager, configuration) { }
        #endregion

        #region RESTful conventions methods
        /// <summary>
        /// Retrieves the Answer with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Answer</param>
        /// <returns>the Answer with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var answer = DbContext.Answers.Where(a => a.Id == id).FirstOrDefault();

            // handle requests asking for non-existing answers
            if (answer == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Answer ID {0} has not been found", id)
                });
            }

            // return found answer
            return new JsonResult(answer.Adapt<AnswerViewModel>());
        }

        /// <summary>
        /// Adds a new Answer to the Database
        /// </summary>
        /// <param name="m">The AnswerViewModel containing the data to insert</param>
        [HttpPut]
        [Authorize]
        public IActionResult Put([FromBody]AnswerViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);

            // retrieve the answer to edit
            var answer = DbContext.Answers.Where(a => a.Id == model.Id).FirstOrDefault();

            // handle requests asking for non-existing answers
            if (answer == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Answer ID {0} has not been found", model.Id)
                });
            }

            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            answer.QuestionId = model.QuestionId;
            answer.Text = model.Text;
            answer.RelatedResultId = model.RelatedResultId;
            answer.Notes = model.Notes;

            // properties set from server-side
            answer.LastModifiedDate = DateTime.Now;

            // persist the changes into the database
            DbContext.SaveChanges();

            // return the updated Quiz to the client
            return new JsonResult(answer.Adapt<AnswerViewModel>());
        }

        /// <summary>
        /// Edit the Answer with the given {id}
        /// </summary>
        /// <param name="m">The AnswerViewModel containing the data to update</param>
        [HttpPost]
        [Authorize]
        public IActionResult Post([FromBody]AnswerViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid
            if (model == null) return new StatusCodeResult(500);

            // map the viewmodel to the model
            var answer = model.Adapt<Answer>();

            // properties set from server-side
            answer.CreatedDate = DateTime.Now;
            answer.LastModifiedDate = answer.CreatedDate;

            // add the new answer
            DbContext.Answers.Add(answer);

            // persist the changes into the database
            DbContext.SaveChanges();

            // return the newly-created answer to the client.
            return new JsonResult(answer.Adapt<AnswerViewModel>());
        }

        /// <summary>
        /// Deletes the Answer with the given {id} from the Database
        /// </summary>
        /// <param name="id">The ID of an existing Answer</param>
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            // retrieve the answer from the database
            var answer = DbContext.Answers.Where(a => a.Id == id)
                            .FirstOrDefault();

            // handle requests asking for non-existing answers
            if (answer == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Answer ID {0} has not been found", id)
                });
            }

            // remove the quiz from the DbContext.
            DbContext.Answers.Remove(answer);

            // persist the changes into the database
            DbContext.SaveChanges();

            // return as HTTP Status 200 (OK)
            return new OkResult();
        }

        #endregion

        #region Attribute-based routing methods
        /// <summary>
        /// GET: api/answer/all/{questionId}
        /// Get an array of a question's answers
        /// </summary>
        /// <param name="questionId">The question ID</param>
        /// <returns>The answers of the requested question as an array</returns>
        [HttpGet("All/{questionId}")]
        public IActionResult All(int questionId)
        {
            var answers = DbContext.Answers.Where(a => a.QuestionId == questionId).ToArray();

            return new JsonResult(answers.Adapt<AnswerViewModel[]>());
        }
        #endregion
    }
}
