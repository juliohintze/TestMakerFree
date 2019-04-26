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
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.Controllers
{
    public class QuizController : BaseApiController
    {
        #region Constructor
        public QuizController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
            : base(context, roleManager, userManager, configuration) { }

        #endregion

        #region RESTful conventions methods
        /// <summary>
        ///  GET: api/quiz/{id}
        ///  Retrieves the Quiz with the given {id}
        /// </summary>
        /// <param name="num">The ID of an existing Quiz</param>
        /// <returns>the Quiz with the given {id}</returns>
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id, bool deep = false)
        {
            Quiz quiz;
            string userId = UserManager.GetUserId(User);
            IQueryable<Quiz> quizQuery = DbContext.Quizzes
                .Where(i => i.Id == id);

            if (deep) quizQuery = quizQuery
                .Include(q => q.Results)
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers);

            quiz = quizQuery.FirstOrDefault();

            // Handle requests asking for non-existing quizzes
            if (quiz == null)
            {
                return NotFound(new {
                    Error = String.Format("Quiz ID {0} has not been found", id)
                });
            }

            quiz.Liked = DbContext.QuizzesLiked
                .Any(ql => ql.QuizId == quiz.Id && ql.UserId == userId);

            return new JsonResult(quiz.Adapt<QuizViewModel>());
        }

        /// <summary>
        /// Adds a new Quiz to the Database
        /// </summary>
        /// <param name="m">The QuizViewModel containing the data to insert</param>
        [HttpPost]
        [Authorize]
        public IActionResult Post([FromBody]QuizViewModel model)
        {
            // return a generic HTTP Status 500 (Server error)
            // if the client payload is invalid
            if (model == null) return new StatusCodeResult(500);

            // handle the insert (without object-mapping)
            var quiz = new Quiz();

            // properties taken from the request
            quiz.Title = model.Title;
            quiz.Description = model.Description;
            quiz.Notes = model.Notes;
            quiz.Published = false;

            // properties set from server-side
            quiz.CreatedDate = DateTime.Now;
            quiz.LastModifiedDate = quiz.CreatedDate;

            // Set a temporary author using the Admin user's userId
            // as user login isn't supported yet: we'll change this later on.
            quiz.UserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            // add the new quiz
            DbContext.Quizzes.Add(quiz);

            // persist the changes into the Database
            DbContext.SaveChanges();

            // return the newly-created Quiz to the client.
            return new JsonResult(quiz.Adapt<QuizViewModel>());
        }

        /// <summary>
        /// Edit the Quiz with the given {id}
        /// </summary>
        /// <param name="m">The QuizViewModel containing the data to update</param>
        [HttpPut]
        [Authorize]
        public IActionResult Put([FromBody]QuizViewModel model)
        {
            // return a generic HTTP Status 500 (Server error)
            // if the client payload is invalid
            if (model == null) return new StatusCodeResult(500);

            // retrieve the quiz to edit
            var quiz = DbContext.Quizzes.Where(q => q.Id == model.Id).FirstOrDefault();

            // handle requests asking for non-existing quizzes
            if (quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz ID {0} has not been found", model.Id)
                });
            }

            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we wnat to accept from the request
            quiz.Title = model.Title;
            quiz.Description = model.Description;
            quiz.Notes = model.Notes;
            quiz.Published = model.Published;

            // properties set from server-side
            quiz.LastModifiedDate = DateTime.Now;

            // persist the changes into the Database
            DbContext.SaveChanges();

            // return the updated quiz to the client.
            return new JsonResult(quiz.Adapt<QuizViewModel>());
        }

        /// <summary>
        /// Deletes the Quiz with the given {id} from the Database
        /// </summary>
        /// <param name="id">The ID of an existing Quiz</param>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            // get the user
            var user = await UserManager.GetUserAsync(User);
            var isAdmin = await UserManager.IsInRoleAsync(user, "Administrator");

            // retrieve the quiz from the database
            var quiz = DbContext.Quizzes.Where(i => i.Id == id).FirstOrDefault();

            // handle requests asking for non-existing quizzes
            if (quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz ID {0} has not been found", id)
                });
            }

            // if the user isn't a admin or the user didn't make the quiz,
            // return a non-authorized status code result
            if ( !(isAdmin || quiz.UserId == user.Id) )
            {
                return new StatusCodeResult(401);
            }

            // remove the quiz from the DbContext
            DbContext.Quizzes.Remove(quiz);

            // persist the changes into the database
            DbContext.SaveChanges();

            // return an HTTP Status 200 (OK)
            return new OkResult();
        }
        #endregion

        #region Attribute-based routing methods
        /// <summary>
        /// GET: api/user
        /// Search for quizzes that match any passed parameter and returns them.
        /// </summary>
        /// <param name="id">The ID of the quiz.</param>
        /// <param name="title">The title of the quiz.</param>
        /// <param name="userId">The ID of the user that made the quiz.</param>
        /// <param name="orderBy">The ordering method. Accepts "latest", "byTitle" or "mostViewed"</param>
        /// <param name="num">The number of quizzes to return</param>
        /// <param name="page">The page number.</param>
        /// <returns>SearchResult<Quiz> object containing the page results, number of results and number of pages</returns>
        [HttpGet]
        public IActionResult SearchQuiz(string title = null, string userId = null, string orderBy = "latest", int? num = 10, int? page = 1)
        {
            int skip = ( (int)page - 1) * (int)num;
            int totalQuizzes, totalPages;
            IQueryable<Quiz> quizzes = DbContext.Quizzes.Where(q => q.Published);

            if (userId != null)
            {
                quizzes = quizzes
                    .Where(q => q.UserId == userId)
                    .OrderByDescending(q => q.CreatedDate);
            } 
            else
            {
                if (orderBy == "latest")
                    quizzes = quizzes.OrderByDescending(q => q.CreatedDate);

                else if (orderBy == "byTitle")
                    quizzes = quizzes.OrderBy(q => q.Title);

                else if (orderBy == "mostViewed")
                    quizzes = quizzes.OrderByDescending(q => q.ViewCount);

                else
                    return new StatusCodeResult(500);
            }

            if (title != null)
                quizzes = quizzes.Where(q => q.Title.ToLower().Contains(title.ToLower()));

            totalQuizzes = quizzes.Count();
            totalPages = totalQuizzes / (int)num;

            if (totalQuizzes % (int)num != 0) totalPages++;

            quizzes = quizzes.Skip(skip).Take((int)num);

            return new JsonResult(new SearchResponseViewModel<QuizViewModel>()
            {
                Results = quizzes.ToArray().Adapt<QuizViewModel[]>(),
                TotalPages = totalPages,
                TotalResults = totalQuizzes
            });
        }
        
        /// <summary>
        /// GET: api/quiz/count
        /// Get the number of quizzes from a user
        /// </summary>
        /// <param name="userId">The ID of the user</param>
        /// <returns>The number of quizzes of the user</returns>
        [HttpGet("count")]
        public IActionResult UserQuizzesCount(string userId)
        {
            if (userId == null) return new StatusCodeResult(500);

            return Json(new
                {
                    QuizCount = DbContext.Quizzes.Where(q => q.Published && q.UserId == userId).Count()
                }
            );
        }

        /// <summary>
        /// GET: api/quiz/like
        /// Get the current user liked quizzes, filtered by title
        /// </summary>
        /// <param name="title">The title of the quiz</param>
        /// <param name="num">The number of results to return</param>
        /// <param name="page">The page of the search</param>
        /// <returns>A SearchResult<Quiz> object containing the page results, number of results and number of pages</returns>
        [HttpGet("like")]
        [Authorize]
        public IActionResult GetLikedQuizzes(string title, int num = 10, int page = 1)
        {
            int skip = (page - 1) * num;
            string userId = UserManager.GetUserId(User);
            IQueryable<QuizLiked> quizzes = DbContext.QuizzesLiked
                .Where(ql => ql.Quiz.Published && ql.UserId == userId)
                .OrderByDescending(ql => ql.Date);

            if (title != null)
                quizzes = quizzes.Where(ql => ql.Quiz.Title.ToLower().Contains(title.ToLower()));

            int totalQuizzes = quizzes.Count();
            int totalPages = totalQuizzes / num;

            if (totalPages % num != 0) totalPages++;

            quizzes = quizzes.Skip(skip).Take(num);

            return new JsonResult(new SearchResponseViewModel<QuizViewModel>()
            {
                TotalPages = totalPages,
                TotalResults = totalQuizzes,
                Results = quizzes.Select(ql => ql.Quiz).ToArray().Adapt<QuizViewModel[]>()
            });
        }

        /// <summary>
        /// GET: api/quiz/take
        /// Get the current user taken quizzes, filtered by title
        /// </summary>
        /// <param name="title">The title of the quiz</param>
        /// <param name="num">The number of results to return</param>
        /// <param name="page">The page of the search</param>
        /// <returns>A SearchResult<Quiz> object containing the page results, number of results and number of pages</returns>
        [HttpGet("take")]
        [Authorize]
        public IActionResult GetTakenQuizzes(string title, int num = 10, int page = 1)
        {
            int skip = (page - 1) * num;
            string userId = UserManager.GetUserId(User);
            IQueryable<QuizTaken> quizzes = DbContext.QuizzesTaken
                .Where(qt => qt.Quiz.Published && qt.UserId == userId)
                .OrderByDescending(qt => qt.Date);

            if (title != null)
                quizzes = quizzes.Where(qt => qt.Quiz.Title.ToLower().Contains(title.ToLower()));

            int totalQuizzes = quizzes.Count();
            int totalPages = totalQuizzes / num;

            if (totalPages % num != 0) totalPages++;

            quizzes = quizzes.Skip(skip).Take(num);

            return new JsonResult(new SearchResponseViewModel<QuizViewModel>()
            {
                TotalPages = totalPages,
                TotalResults = totalQuizzes,
                Results = quizzes.Select(qt => qt.Quiz).ToArray().Adapt<QuizViewModel[]>()
            });
        }

        /// <summary>
        /// GET: api/quiz/made
        /// Get the current user made quizzes, including non-publisheds.
        /// </summary>
        /// <param name="title"></param>
        /// <param name="num"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet("made")]
        [Authorize]
        public IActionResult GetMadeQuizzes(string title, int num = 10, int page = 1)
        {
            int skip = (page - 1) * num;
            string userId = UserManager.GetUserId(User);
            IQueryable<Quiz> quizzes = DbContext.Quizzes
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.CreatedDate);

            if (title != null)
                quizzes = quizzes.Where(q => q.Title.ToLower().Contains(title.ToLower()));

            int totalQuizzes = quizzes.Count();
            int totalPages = totalQuizzes / num;

            if (totalPages % num != 0) totalPages++;

            quizzes = quizzes.Skip(skip).Take(num);

            return new JsonResult(new SearchResponseViewModel<QuizViewModel>()
            {
                TotalPages = totalPages,
                TotalResults = totalQuizzes,
                Results = quizzes.ToArray().Adapt<QuizViewModel[]>()
            });
        }

        /// <summary>
        /// PUT: api/quiz/like
        /// Like or unlike a quiz
        /// </summary>
        /// <param name="model">The quiz to be liked/unliked</param>
        /// <returns>The liked/unliked quiz</returns>
        [HttpPut("like")]
        [Authorize]
        public IActionResult LikeQuiz([FromBody]QuizViewModel model)
        {
            Quiz quiz;
            ApplicationUser user;
            QuizLiked quizLiked;
            string userId;

            if (model == null) return new StatusCodeResult(500);

            quiz = DbContext.Quizzes
                .Where(q => q.Published && q.Id == model.Id)
                .FirstOrDefault();

            if (quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz with ID {0} not found.", model.Id)
                });
            }

            userId = UserManager.GetUserId(User);

            if (quiz.UserId != userId)
            {
                user = DbContext.Users
                    .Where(u => u.Id == userId)
                    .Include(u => u.LikedQuizzes)
                    .FirstOrDefault();

                quizLiked = user.LikedQuizzes.Find(q => q.QuizId == quiz.Id);
                if (quizLiked == null)
                {
                    quiz.Liked = true;
                    quiz.LikeCount++;
                    DbContext.QuizzesLiked.Add(new QuizLiked()
                    {
                        QuizId = quiz.Id,
                        UserId = user.Id,
                        Date = DateTime.Now
                    });
                }
                else
                {
                    quiz.Liked = false;
                    quiz.LikeCount--;
                    DbContext.QuizzesLiked.Remove(quizLiked);
                }

                DbContext.SaveChanges();
            }

            return Json(quiz.Adapt<QuizViewModel>());

        }

        /// <summary>
        /// PUT: api/quiz/take
        /// Take a quiz, if it's not yours
        /// </summary>
        /// <param name="model">The quiz to be taken</param>
        /// <returns>The taken quiz</returns>
        [HttpPut("take")]
        [Authorize]
        public IActionResult TakeQuiz([FromBody]QuizViewModel model)
        {
            Quiz quiz;
            string userId;

            if (model == null) return new StatusCodeResult(500);

            quiz = DbContext.Quizzes
                .Where(q => q.Published && q.Id == model.Id)
                .FirstOrDefault();

            if (quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz with id {0} not found.", model.Id)
                });
            }

            userId = UserManager.GetUserId(User);

            if (!DbContext.QuizzesTaken.Any(qt => qt.UserId == userId && qt.QuizId == quiz.Id))
            {
                quiz.ViewCount++;

                DbContext.QuizzesTaken.Add(new QuizTaken()
                {
                    QuizId = quiz.Id,
                    UserId = userId,
                    Date = DateTime.Now
                });

                DbContext.SaveChanges();
            }

            return Json(quiz.Adapt<QuizViewModel>());
        }

        [HttpPut("publish/{id}")]
        [Authorize]
        public IActionResult TogglePublishQuiz(int id)
        {
            Quiz quiz = DbContext.Quizzes
                .Where(q => q.Id == id)
                .FirstOrDefault();
            
            if (quiz == null) return NotFound(new
            {
                Error = String.Format("Quiz ID {0} has not been found", id)
            });

            if (quiz.UserId != UserManager.GetUserId(User))
                return new UnauthorizedResult();

            quiz.Published = !quiz.Published;

            DbContext.SaveChanges();

            return new JsonResult(quiz.Adapt<QuizViewModel>());
        }

        #endregion

        #region Helper methods
        private QuizValidation ValidateQuiz(QuizViewModel model)
        {
            List<int> possibleResults = new List<int>();
            QuizValidation validation = new QuizValidation();
            validation.Valid = true;

            if (model == null)
            {
                validation.Valid = false;
                validation.Messages.Add("Quiz is null");
                return validation;
            }

            if (model.Questions == null || model.Questions.Count == 0)
            {
                validation.Valid = false;
                validation.Messages.Add("The quiz has no questions");
            }
            else
            {
                model.Questions.ForEach(q =>
                {
                    if (q.Answers == null || q.Answers.Count == 0)
                    {
                        validation.Valid = false;
                        validation.Messages.Add(String.Format("The question \"{0}\" has no answers.", q.Text));
                    }
                });
            }

            if (model.Results == null || model.Results.Count == 0)
            {
                validation.Valid = false;
                validation.Messages.Add("The quiz has no results");
            }

            return validation;
        }
        #endregion
    }
}