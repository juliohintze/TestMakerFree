using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.Data.Models
{
    public class QuizValidation
    {
        public bool Valid { get; set; }
        public List<string> Messages { get; set; }
    }
}
