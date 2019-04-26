using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class SearchResponseViewModel<T>
    {
        #region Constructor
        public SearchResponseViewModel()
        {

        }
        #endregion

        #region Properties
        public int TotalPages { get; set; }
        public int TotalResults { get; set; }
        public T[] Results { get; set; }
        #endregion
    }
}