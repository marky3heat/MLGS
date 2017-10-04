﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using iPOS.Web.Service.Interface;
using iPOS.Web.Database;
using iPOS.Web.Models;
using iPOS.Web.Areas.Administrator.Models;
using iPOS.Web.Repository;
using iPOS.Web.Service;

namespace iPOS.Web.Areas.Administrator.Controllers
{
    public class TransactionsController : Controller
    {
        #region PUBLIC CONSTRUCTOR
        private readonly IPawningService _pawningService;
        private readonly IAppraisalService _appraisalService;
        private readonly ICustomerService _customerService;
        private readonly IReferenceService _referenceService;
        private readonly IPawnshopTransactionService _pawnshopTransactionService;

        public TransactionsController(
            IPawningService pawningService,
            IAppraisalService appraisalService,
            ICustomerService customerServic,
            IReferenceService referenceService,
            IPawnshopTransactionService pawnshopTransactionService)
        {
            _pawningService = pawningService;
            _appraisalService = appraisalService;
            _customerService = customerServic;
            _referenceService = referenceService;
            _pawnshopTransactionService = pawnshopTransactionService;
        }
        public TransactionsController()
        {
            _pawningService = new PawningService(new UnitOfWorkFactory());
            _appraisalService = new AppraisalService(new UnitOfWorkFactory());
            _customerService = new CustomerService(new UnitOfWorkFactory());
            _referenceService = new ReferenceService(new UnitOfWorkFactory());
            _pawnshopTransactionService = new PawnshopTransactionService(new UnitOfWorkFactory());
        }
        #endregion

        #region VIEW
        // GET: Administrator/Transactions
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NewTransaction()
        {
            return View();
        }

        public ActionResult Appraisal()
        {
            return View();
        }

        public ActionResult Approval()
        {
            return View();
        }

        public ActionResult ChangeInTerms()
        {
            return View();
        }
        #endregion

        #region JSON REQUEST METHODS(TRANSACTIONS)
        public async Task<JsonResult> GetTransactions()
        {
            var listPawnshopTransactions = await _pawnshopTransactionService.GetListPawnshopTransactions();
            var listCustomer = await _customerService.GetCustomerList();

            var result =
                from a in listPawnshopTransactions
                join b in listCustomer on a.CustomerId equals b.autonum.ToString()
                select new
                {
                    a.TransactionId,
                    a.TransactionNo,
                    a.TransactionType,
                    a.TransactionDate,
                    a.Status,
                    b.first_name,
                    b.last_name
                };

            return Json(new { data = result.OrderByDescending(d => d.Status).ThenBy(s => s.TransactionType) }, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> SaveTransactionPawning(TransactionsModel model)
        {
            try
            {
                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(model.TransactionId.ToString()) || model.TransactionId.ToString() == "0")
                {
                    tbl_ipos_pawnshop_transactions model1 = new tbl_ipos_pawnshop_transactions();
                    model1.TransactionNo = model.TransactionNo;
                    model1.TransactionDate = model.TransactionDate;
                    model1.TransactionType = "Pawning";
                    model1.CustomerId = model.CustomerId;
                    model1.Terminal = "1";
                    model1.Status = "For appraisal";
                    model1.ReviewedBy = "";
                    model1.ApprovedBy = "";
                    model1.CreatedBy = "";
                    model1.CreatedAt = DateTime.Now;

                    tbl_ipos_appraiseditem model2 = new tbl_ipos_appraiseditem();
                    model2.AppraiseDate = DateTime.Now;
                    model2.AppraiseNo = "";
                    model2.ItemTypeId = model.ItemTypeId;
                    model2.ItemCategoryId = model.ItemCategoryId;
                    model2.ItemName = model.ItemName;
                    model2.Weight = "";
                    model2.AppraisedValue = 0;
                    model2.Remarks = model.Remarks;
                    model2.CustomerFirstName = model.first_name;
                    model2.CustomerLastName = model.last_name;
                    model2.IsPawned = false;
                    model2.CreatedAt = DateTime.Now;
                    model2.CreatedBy = "";
                    model2.PawnshopTransactionId = model.TransactionNo.ToString();

                    var result = await _pawnshopTransactionService.SavePawnshopTransactions(model1);
                    var result1 = await _appraisalService.Save(model2);

                    success = result;
                    success = result1;

                    if (result)
                    {
                        tbl_ipos_no_generator noGenerator = new tbl_ipos_no_generator();
                        noGenerator = await _referenceService.FindByIdAndTerminalNoGenerator(1, "1");
                        noGenerator.No = Int32.Parse(model.TransactionNo) + 1;
                        await _referenceService.UpdateNoGenerator(noGenerator);

                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Duplicate entry.";
                    }
                }

                return Json(new { success = success, message = message });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion
    }
}