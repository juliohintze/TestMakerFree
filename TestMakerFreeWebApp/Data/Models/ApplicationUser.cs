using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestMakerFreeWebApp.Data.Models
{
    public class ApplicationUser : IdentityUser
    {

        #region Constructor
        public ApplicationUser()
        {
                
        }
        #endregion

        #region Properties
        public string DisplayName { get; set; }

        public string Notes { get; set; }

        [Required]
        public int Type { get; set; }

        [Required]
        public int Flags { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion

        #region Lazy-Load Properties
        /// <summary>
        /// A list of all the quiz created by this user.
        /// </summary>
        public virtual List<Quiz> Quizzes { get; set; }

        public virtual List<QuizTaken> TakenQuizzes { get; set; }

        public virtual List<QuizLiked> LikedQuizzes { get; set; }

        /// <summary>
        /// A list of all the refresh tokens issued for this user.
        /// </summary>
        public virtual List<Token> Tokens { get; set; }
        #endregion
    }
}
