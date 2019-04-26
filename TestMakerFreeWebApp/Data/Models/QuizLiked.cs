using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.Data.Models
{
    public class QuizLiked
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public DateTime Date { get; set; }
    }
}
