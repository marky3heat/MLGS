using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iPOS.Web.Areas.Administrator.Models
{
    public class ApproveTransactionModel
    {
        //Transaction
        public int TransactionId { get; set; }
        public string TransactionNo { get; set; }
        public System.DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; }
        public string CustomerId { get; set; }
        public string Terminal { get; set; }
        public string Status { get; set; }
        public string ReviewedBy { get; set; }
        public string ApprovedBy { get; set; }
        public string CreatedBy { get; set; }
        public System.DateTime CreatedAt { get; set; }

        //AppraisedItem
        public int AppraiseId { get; set; }
        public System.DateTime AppraiseDate { get; set; }
        public string AppraiseNo { get; set; }
        public int ItemTypeId { get; set; }
        public int ItemCategoryId { get; set; }
        public string ItemName { get; set; }
        public string ItemFeature { get; set; }
        public string SerialNo { get; set; }
        public string ItemCondition { get; set; }
        public string Brand { get; set; }
        public string Karat { get; set; }
        public string Weight { get; set; }
        public decimal AppraisedValue { get; set; }
        public string Remarks { get; set; }
        public string CustomerFirstName { get; set; }
        public string CustomerLastName { get; set; }
        public bool IsPawned { get; set; }
        public string PawnshopTransactionId { get; set; }

        //PawnedItem
        public int PawnedItemId { get; set; }
        public string PawnedItemNo { get; set; }
        public System.DateTime PawnedDate { get; set; }
        public string PawnedItemContractNo { get; set; }
        public decimal LoanableAmount { get; set; }
        public decimal InterestRate { get; set; }
        public decimal InterestAmount { get; set; }
        public decimal InitialPayment { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Others { get; set; }
        public bool IsInterestDeducted { get; set; }
        public decimal NetCashOut { get; set; }
        public string TermsId { get; set; }
        public string ScheduleOfPayment { get; set; }
        public int NoOfPayments { get; set; }
        public System.DateTime DueDateStart { get; set; }
        public System.DateTime DueDateEnd { get; set; }
        public bool IsReleased { get; set; }
        public string Scheme { get; set; }

        //Customer
        public int autonum { get; set; }
        public long id_code { get; set; }
        public string trade_name { get; set; }
        public string customer_class { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string business_phone_no { get; set; }
        public string mobile_no { get; set; }
        public string fax_no { get; set; }
        public string st_address { get; set; }
        public string city_address { get; set; }
        public int zip_code { get; set; }
        public string vat { get; set; }
        public string bir_reg_no { get; set; }
        public string tax_id_no { get; set; }
        public short credit_terms { get; set; }
        public double credit_limit { get; set; }
        public double balance { get; set; }
        public System.DateTime date_as_of { get; set; }
        public string active { get; set; }
        public int group_id { get; set; }
        public string group_name { get; set; }
        public string remarks { get; set; }
        public byte[] customer_image { get; set; }
        public System.DateTime date_entered { get; set; }
        public int ul_code { get; set; }
        public string created_by { get; set; }
        public System.DateTime date_created { get; set; }
        public string update_by { get; set; }
        public System.DateTime date_update { get; set; }
    }
}