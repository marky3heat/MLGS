using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iPOS.Web.Areas.Administrator.Models
{
    public class PawnshopTransactionModel
    {
        public int TransactionId { get; set; }
        public string TransactionNo { get; set; }
        public System.DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; }
        public string CustomerId { get; set; }
        public string Terminal { get; set; }
        public string Status { get; set; }
        public string ReviewedBy { get; set; }
        public string ApprovedBy { get; set; }

        public string ItemName { get; set; }
        public int ItemTypeId { get; set; }
        public int ItemCategoryId { get; set; }
        public string Remarks { get; set; }

        public string first_name { get; set; }
        public string last_name { get; set; }
        public string st_address { get; set; }
        public string mobile_no { get; set; }
    }
}