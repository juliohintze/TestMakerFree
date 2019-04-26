using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class UserViewModel
    {
        #region Constructor
        public UserViewModel()
        {

        }
        #endregion

        #region Properties
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }

        public List<QuizViewModel> Quizzes { get; set; }
        public List<QuizViewModel> LikedQuizzes { get; set; }
        public List<QuizViewModel> TakenQuizzes { get; set; }
        #endregion


    }
}
