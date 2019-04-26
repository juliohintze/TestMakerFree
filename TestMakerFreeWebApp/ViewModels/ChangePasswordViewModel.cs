using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class ChangePasswordViewModel
    {
        #region Constructor
        public ChangePasswordViewModel()
        {

        }
        #endregion

        #region Properties
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        #endregion
    }
}
