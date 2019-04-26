using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestMakerFreeWebApp.Data.Models;

namespace TestMakerFreeWebApp.Data
{
    public static class DbSeeder
    {
        #region Public Methods
        public static void Seed(
            ApplicationDbContext dbContext,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            // Create default Users (if there are none)
            if (!dbContext.Users.Any())
                CreateUsers(dbContext, roleManager, userManager)
                .GetAwaiter()
                .GetResult();

            // Create default Quizzes (if there are none) together
            // with their set of Q&A
            if (!dbContext.Quizzes.Any()) CreateQuizzes(dbContext);
        }
        #endregion

        #region Seed Methods
        private static async Task CreateUsers(
            ApplicationDbContext dbContext,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            // local variables
            DateTime createdDate = new DateTime(2018, 10, 5, 12, 32, 09);
            DateTime lastModifiedDate = DateTime.Now;

            string role_Administrator = "Administrator";
            string role_RegisteredUser = "RegisteredUser";

            ApplicationUser user;

            // Create Roles (if they doesn't exist yet)
            if (!await roleManager.RoleExistsAsync(role_Administrator))
            {
                await roleManager.CreateAsync(new
                    IdentityRole(role_Administrator));
            }
            if (!await roleManager.RoleExistsAsync(role_RegisteredUser))
            {
                await roleManager.CreateAsync(new
                    IdentityRole(role_RegisteredUser));
            }

            // Create the "Admin" ApplicationUser account (if it doesn't exist already)
            var user_Admin = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "admin@testmakerfree.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            // Insert "Admin" into the Database and assign the "Administrator"
            // and "RegisteredUser" roles to him
            if (await userManager.FindByNameAsync(user_Admin.UserName) == null)
            {
                await userManager.CreateAsync(user_Admin, "Pass4Admin");
                await userManager.AddToRoleAsync(user_Admin, role_RegisteredUser);
                await userManager.AddToRoleAsync(user_Admin, role_Administrator);

                // Remove lockout and e-mail confirmation
                user_Admin.EmailConfirmed = true;
                user_Admin.LockoutEnabled = false;
            }

#if DEBUG
            // Create some sample registered user accounts (if they don't exist already)
            List<string> names = new List<string>() { "Ryan", "Solice", "Vodan", "Gabriela", "Renan", "Alexandre" };

            foreach (var name in names)
            {
                user = new ApplicationUser()
                {
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = name,
                    Email = String.Format("{0}@testmakerfree.com", name.ToLower()),
                    CreatedDate = createdDate,
                    LastModifiedDate = lastModifiedDate
                };

                // Insert sample registered users into the database and algo assign the
                // "Registered" role to him
                if (await userManager.FindByNameAsync(user.UserName) == null)
                {
                    await userManager.CreateAsync(user, String.Format("Pass4{0}", user.UserName));
                    await userManager.AddToRoleAsync(user, role_RegisteredUser);

                    // Remove lockout and e-mail confirmation
                    user.EmailConfirmed = true;
                    user.LockoutEnabled = false;
                }
            }
#endif

            await dbContext.SaveChangesAsync();
        }

        private static void CreateQuizzes(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = new DateTime(2018, 10, 5, 12, 32, 09);
            DateTime lastModifiedDate = DateTime.Now;

            // retrieve the admin user, which we'll use as default author
            var authorId = dbContext.Users
                .Where(u => u.UserName == "Admin")
                .FirstOrDefault()
                .Id;

#if DEBUG
            // create 47 sample quizzes with auto-generated data
            // (includin questions, answers & results)
            var num = 47;
            for (int i = 1; i <= num; i++)
            {
                CreateSampleQuiz(
                    dbContext,
                    i,
                    authorId,
                    num - i,
                    3,
                    createdDate.AddDays(-num));
            }
#endif
            // create 3 more quizzes with better descriptive data
            // (we'll add the questions, answers & results later on)
            EntityEntry<Quiz> e1 = dbContext.Quizzes.Add(new Quiz()
            {
                UserId = authorId,
                Title = "Are you more Light or Dark side of the Force?",
                Description = @"Choose wisely you must, young padawan: " +
                    "this test will prove if your will is strong enough " +
                    "to adhere to the principles of the light side of the Force " +
                    "or if you're fated to embrace the dark side. " +
                    "No you want to become a true JEDI, you can't possibly miss this!",
                ViewCount = 2343,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate,
                Published = false
            });

            EntityEntry<Quiz> e2 = dbContext.Quizzes.Add(new Quiz()
            {
                UserId = authorId,
                Title = "GenX, GenY or GenZ?",
                Description = @"Do you feel confortable in your generation? " +
                        "What year should you have been born in? " +
                        "Here's a bunch of questions that will help you to find out!",
                ViewCount = 4180,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate,
                Published = false
            });

            EntityEntry<Quiz> e3 = dbContext.Quizzes.Add(new Quiz()
            {
                UserId = authorId,
                Title = "Which Shingeki No Kyojin character are you?",
                Description = @"Do you relentlessly seek revenge like Eren? " +
                        "Are you willing to put your like on the stake to protect your friends like Mikasa? " +
                        "Would you trust your fighting skills like Levi " +
                        "or rely on your strategies and tactics like Arwin? " +
                        "Unveil your true self with this Attack On Titan personality test!",
                ViewCount = 5203,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate,
                Published = false
            });

            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        #endregion

        #region Utility Methods
        /// <summary>
        /// Creates a sample quiz and add it to the Database
        /// together with a sample set of questions, answers and results.
        /// </summary>
        /// <param name="authorId">the author ID</param>
        /// <param name="num">the number of the quiz</param>
        /// <param name="createdDate">the quiz CreatedDate</param>
        private static void CreateSampleQuiz(
            ApplicationDbContext dbContext,
            int num,
            string authorId,
            int viewCount,
            int numberOfQuestions,
            DateTime createdDate)
        {
            // Create the quiz
            var quiz = new Quiz()
            {
                UserId = authorId,
                Title = String.Format("Quiz {0} Title", num),
                Description = String.Format("This is a sample description for quiz {0}.", num),
                ViewCount = viewCount,
                CreatedDate = createdDate,
                LastModifiedDate = createdDate,
                Published = true
            };

            // Insert the quiz into the database
            dbContext.Quizzes.Add(quiz);
            dbContext.SaveChanges();

            for (int i = 0; i < numberOfQuestions; i++)
            {
                // Create a result
                var result = new Result()
                {
                    Priority = i + 1,
                    Text = String.Format("This is the sample result #{0}", i + 1),
                    QuizId = quiz.Id,
                    CreatedDate = createdDate,
                    LastModifiedDate = createdDate
                };

                // Insert it into the database to get it's id
                dbContext.Results.Add(result);
                dbContext.SaveChanges();

                // Create a question
                var question = new Question()
                {
                    Text = String.Format("Sample question #{0}", i + 1),
                    QuizId = quiz.Id,
                    CreatedDate = createdDate,
                    LastModifiedDate = createdDate
                };

                // Insert it into the database to get it's id
                dbContext.Questions.Add(question);
                dbContext.SaveChanges();

                for (int j = 0; j < numberOfQuestions; j++)
                {
                    // Create an answer
                    var answer = new Answer()
                    {
                        QuestionId = question.Id,
                        RelatedResultId = result.Id,
                        Text = String.Format("Sample result {0}", j + 1),
                        CreatedDate = createdDate,
                        LastModifiedDate = createdDate
                    };

                    // Insert it into the database
                    dbContext.Answers.Add(answer);
                }

                dbContext.SaveChanges();
            }
        }
        #endregion
    }
}
