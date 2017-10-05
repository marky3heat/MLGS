using System;
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
        public async Task<JsonResult> GetTransactionsById(int TransactionId)
        {
            var listTransaction = await _pawnshopTransactionService.FindByIdPawnshopTransactions(TransactionId);

            return Json(listTransaction, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> GetCustomerById(int CustomerId)
        {
            var listCustomer = await _customerService.FindByIdCustomer(CustomerId);

            return Json(listCustomer, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> GetItemByTransactionNo(string TransactionNo)
        {
            var listItem = await _appraisalService.FindByTransactionNo(TransactionNo);

            return Json(listItem, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetPawnedItemByTransactionNo(string TransactionNo)
        {
            var listItem = await _pawningService.FindByTransactionNo(TransactionNo);

            return Json(listItem, JsonRequestBehavior.AllowGet);
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
                    model2.ItemFeature = "";
                    model2.SerialNo = "";
                    model2.ItemCondition = "";
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
        public async Task<JsonResult> SaveAppraisal(tbl_ipos_appraiseditem model)
        {
            try
            {
                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(model.AppraiseId.ToString()) || model.AppraiseId.ToString() == "0")
                {
                    tbl_ipos_appraiseditem model1 = new tbl_ipos_appraiseditem();
                    model1.AppraiseDate = model.AppraiseDate;
                    //model1.AppraiseNo = "";
                    //model1.ItemTypeId = model.ItemTypeId;
                    //model1.ItemCategoryId = model.ItemCategoryId;
                    //model1.ItemName = model.ItemName;
                    model1.ItemFeature = model.ItemFeature;
                    model1.SerialNo = model.SerialNo;
                    model1.ItemCondition = model.ItemCondition;
                    model1.Weight = model.Weight;
                    model1.AppraisedValue = model.AppraisedValue;
                    //model1.Remarks = model.Remarks;
                    //model1.CustomerFirstName = model.first_name;
                    //model1.CustomerLastName = model.last_name;
                    //model1.IsPawned = false;
                    //model1.CreatedAt = DateTime.Now;
                    //model1.CreatedBy = "";
                    //model1.PawnshopTransactionId = model.TransactionNo.ToString();

                    var result = await _appraisalService.Save(model1);

                    success = result;

                    if (result)
                    {
                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Duplicate entry.";
                    }
                }
                else
                {
                    tbl_ipos_appraiseditem model1 = new tbl_ipos_appraiseditem();
                    model1 = await _appraisalService.FindByTransactionNo(model.PawnshopTransactionId);
                    model1.AppraiseDate = model.AppraiseDate;
                    //model1.AppraiseNo = "";
                    //model1.ItemTypeId = model.ItemTypeId;
                    //model1.ItemCategoryId = model.ItemCategoryId;
                    //model1.ItemName = model.ItemName;
                    model1.ItemFeature = model.ItemFeature;
                    model1.SerialNo = model.SerialNo;
                    model1.ItemCondition = model.ItemCondition;
                    model1.Karat = model.Karat;
                    model1.Weight = model.Weight;
                    model1.AppraisedValue = model.AppraisedValue;
                    //model1.Remarks = model.Remarks;
                    //model1.CustomerFirstName = model.first_name;
                    //model1.CustomerLastName = model.last_name;
                    //model1.IsPawned = false;
                    //model1.CreatedAt = DateTime.Now;
                    //model1.CreatedBy = "";
                    //model1.PawnshopTransactionId = model.TransactionNo.ToString();
                    var result = await _appraisalService.Update(model1);
                    success = result;
                    if (result)
                    {
                        tbl_ipos_pawnshop_transactions model2 = await _pawnshopTransactionService.FindByTransactionNo(model.PawnshopTransactionId);
                        model2.Status = "For pawning";
                        await _pawnshopTransactionService.UpdatePawnshopTransactions(model2);

                        message = "Successfully updated.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
                    }
                }

                return Json(new { success = success, message = message });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<JsonResult> SavePawning(tbl_ipos_pawneditem model)
        {
            try
            {
                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(model.PawnedItemId.ToString()) || model.PawnedItemId.ToString() == "0")
                {
                    tbl_ipos_pawneditem model1 = new tbl_ipos_pawneditem();
                    model1.PawnedItemNo = model.PawnedItemNo;
                    model1.PawnedDate = model.PawnedDate;
                    model1.TransactionNo = model.TransactionNo;
                    model1.PawnedItemContractNo = model.PawnedItemContractNo;
                    model1.LoanableAmount = model.LoanableAmount;
                    model1.InterestRate = model.InterestRate;
                    model1.InterestAmount = model.InterestAmount;
                    model1.InitialPayment = model.InitialPayment;
                    model1.ServiceCharge = model.ServiceCharge;
                    model1.Others = model.Others;
                    model1.IsInterestDeducted = model.IsInterestDeducted;
                    model1.NetCashOut = model.NetCashOut;
                    model1.TermsId = model.TermsId;
                    model1.ScheduleOfPayment = model.ScheduleOfPayment;
                    model1.NoOfPayments = model.NoOfPayments;
                    model1.DueDateStart = model.DueDateStart;
                    model1.DueDateEnd = model.DueDateEnd;
                    model1.Status = "";
                    model1.IsReleased = false;
                    model1.CreatedBy = "";
                    model1.CreatedAt = DateTime.Now;

                    var result = await _pawningService.Save(model1);

                    success = result;

                    if (result)
                    {
                        tbl_ipos_pawnshop_transactions model2 = await _pawnshopTransactionService.FindByTransactionNo(model.TransactionNo);
                        model2.Status = "For approval";
                        await _pawnshopTransactionService.UpdatePawnshopTransactions(model2);

                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Duplicate entry.";
                    }
                }
                else
                {
                    tbl_ipos_pawneditem model1 = new tbl_ipos_pawneditem();
                    model1 = await _pawningService.FindById(model.PawnedItemId);
                    model1.PawnedDate = model.PawnedDate;
                    model1.TransactionNo = model.TransactionNo;
                    model1.PawnedItemContractNo = model.PawnedItemContractNo;
                    model1.LoanableAmount = model.LoanableAmount;
                    model1.InterestRate = model.InterestRate;
                    model1.InterestAmount = model.InterestAmount;
                    model1.InitialPayment = model.InitialPayment;
                    model1.ServiceCharge = model.ServiceCharge;
                    model1.Others = model.Others;
                    model1.IsInterestDeducted = model.IsInterestDeducted;
                    model1.NetCashOut = model.NetCashOut;
                    model1.TermsId = model.TermsId;
                    model1.ScheduleOfPayment = model.ScheduleOfPayment;
                    model1.NoOfPayments = model.NoOfPayments;
                    model1.DueDateStart = model.DueDateStart;
                    model1.DueDateEnd = model.DueDateEnd;

                    var result = await _pawningService.Update(model1);
                    success = result;
                    if (result)
                    {
                        tbl_ipos_pawnshop_transactions model2 = await _pawnshopTransactionService.FindByTransactionNo(model.TransactionNo);
                        model2.Status = "For approval";
                        await _pawnshopTransactionService.UpdatePawnshopTransactions(model2);

                        message = "Successfully updated.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
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