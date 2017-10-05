using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iPOS.Web.Areas.Administrator.Models
{
    public class TransactionCounterModel
    {
        public string NewTransaction { get; set; }
        public string ForAppraisal { get; set; }
        public string ForPawning { get; set; }
        public string ForApproval { get; set; }
        public string ForRelease { get; set; }
    }
}