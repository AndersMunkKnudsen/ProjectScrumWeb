//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ScrumWeb.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class Iterations
    {
        public string IterationID { get; set; }
        public string IterationName { get; set; }
        public string IterationDescription { get; set; }
        //public Nullable<System.DateTime> IterationStartDate { get; set; }

        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy/MM/dd}")]
        [DataType(DataType.Date)]
        public Nullable<DateTime> IterationStartDate
        {
            get;
            set;
        }

        //public Nullable<System.DateTime> IterationEndDate { get; set; }

        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy/MM/dd}")]
        [DataType(DataType.Date)]
        public Nullable<DateTime> IterationEndDate
        {
            get;
            set;
        }

        public string IterationProjectID { get; set; }
    }
}
