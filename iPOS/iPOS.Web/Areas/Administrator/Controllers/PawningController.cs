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
using iPOS.Web.Repository;
using iPOS.Web.Service;

namespace iPOS.Web.Areas.Administrator.Controllers
{
    public class PawningController : Controller
    {
        #region PUBLIC CONSTRUCTOR
        private readonly IPawningService _pawningService;
        private readonly IAppraisalService _appraisalService;
        private readonly ICustomerService _customerService;
        private readonly IReferenceService _referenceService;

        public PawningController(
            IPawningService pawningService,
            IAppraisalService appraisalService,
            ICustomerService customerServic,
            IReferenceService referenceService)
        {
            _pawningService = pawningService;
            _appraisalService = appraisalService;
            _customerService = customerServic;
            _referenceService = referenceService;
        }
        public PawningController()
        {
            _pawningService = new PawningService(new UnitOfWorkFactory());
            _appraisalService = new AppraisalService(new UnitOfWorkFactory());
            _customerService = new CustomerService(new UnitOfWorkFactory());
            _referenceService = new ReferenceService(new UnitOfWorkFactory());
        }
        #endregion

        #region VIEW
        // GET: Administrator/Pawning
        public ActionResult Index()
        {
            ViewBag.Form = "Pawning";
            ViewBag.Controller = "Pawning";
            ViewBag.Action = "Module";

            return View();
        }
        #endregion

        #region JSON REQUEST METHODS
        // GET
        [HttpGet]
        public async Task<JsonResult> GetPawnedItems()
        {
            var listPawnedItem = await _pawningService.GetNormalList();
            var listAppraisedItem = await _appraisalService.GetList();
            var listCustomer = await _customerService.GetCustomerList();

            var result =
                from a in listPawnedItem
                join c in listCustomer on a.CustomerId equals  c.autonum
                select new
                {
                    a.PawnedItemId,
                    a.PawnedItemNo,
                    a.PawnedDate,
                    a.CustomerId,
                    a.PawnedItemContractNo,
                    a.LoanableAmount,
                    a.InterestRate,
                    a.InterestAmount,
                    a.InitialPayment,
                    a.ServiceCharge,
                    a.Others,
                    a.IsInterestDeducted,
                    a.NetCashOut,
                    a.TermsId,
                    a.ScheduleOfPayment,
                    a.NoOfPayments,
                    a.DueDateStart,
                    a.DueDateEnd,
                    a.Status,
                    a.IsReleased,
                    a.CreatedBy,
                    a.CreatedAt,
                    c.first_name,
                    c.last_name
                };

            return Json(new { data = result.OrderByDescending(d => d.PawnedDate).ThenBy(s => s.IsReleased) }, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetAppraisedItem()
        {
            var listAppraisedItem = await _appraisalService.GetList();
            var result =
                from a in listAppraisedItem
                where a.IsPawned.Equals(false)
                select new
                {
                    a.AppraiseId,
                    a.ItemName
                };

            return Json(result.OrderBy(o => o.ItemName), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetCustomer()
        {
            var listCustomer = await _customerService.GetCustomerList();
            var result = listCustomer.Select(item => new tbl_ipos_customer()
            {
                CustomerId = item.autonum,
                FirstName = item.first_name + " " + item.last_name,
                LastName = item.last_name
            });

            return Json(result.OrderBy(o => o.LastName), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetAppraisedItemById(int AppraisedItemId)
        {
            var listAppraisedItem = await _appraisalService.FindByIdList(AppraisedItemId);
            var listItemType = await _referenceService.GetItemTypeList();
            var listItemCategory = await _referenceService.GetItemCategoryList();

            var result = from a in listAppraisedItem
            join b in listItemType on a.ItemTypeId equals b.ItemTypeId
            join c in listItemCategory on a.ItemCategoryId equals c.ItemCategoryId
            where a.IsPawned.Equals(false)
            select new
            {
                a.AppraiseId,
                b.ItemTypeName,
                c.ItemCategoryName,
                a.Weight,
                a.AppraisedValue,
                a.Remarks,
                a.ItemName
            };

            return Json(new { data = result.ToList() }, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetCustomerById(int CustomerId)
        {
            var listCustomer = await _customerService.FindByIdCustomer(CustomerId);

            return Json(listCustomer, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetItemCode()
        {
            var result = _pawningService.GetItemCode();

            return Json(result + 1, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetContractNo()
        {
            var result = _pawningService.GetContractNo();

            return Json(result + 1, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetServerDate()
        {
            var serverDate = DateTime.Now.ToString("MM/dd/yyyy");

            return Json(serverDate, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> SaveCustomer(tbl_customer list)
        {
            try
            {
                tbl_customer model = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(list.autonum.ToString()) || list.autonum.ToString() == "0")
                {
                    //DateTime dt = DateTime.ParseExact(item.AppraiseDate, "yyyy/MM/dd", CultureInfo.InvariantCulture);

                    model = new tbl_customer();
                    model.first_name = list.first_name;
                    model.last_name = list.last_name;
                    model.middle_name = list.middle_name;
                    model.st_address = list.st_address;
                    model.mobile_no = list.mobile_no;

                    var result = await _customerService.SaveCustomer(model);
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
                    model = await _customerService.FindByIdCustomer(list.autonum);
                    model.first_name = list.first_name;
                    model.last_name = list.last_name;
                    model.middle_name = list.middle_name;
                    model.st_address = list.st_address;
                    model.mobile_no = list.mobile_no;

                    var result = await _customerService.UpdateCustomer(model);
                    success = result;
                    if (result)
                    {
                        message = "Successfully updated.";
                    }
                    else
                        message = "Error saving data. Please contact administrator.";
                }

                return Json(new { success = success, message = message });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<JsonResult> SavePawnedItem(tbl_ipos_pawneditem list)
        {
            try
            {
                tbl_ipos_pawneditem model = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(list.PawnedItemId.ToString()) || list.PawnedItemId.ToString() == "0")
                {
                    //DateTime dt = DateTime.ParseExact(item.AppraiseDate, "yyyy/MM/dd", CultureInfo.InvariantCulture);

                    model = new tbl_ipos_pawneditem();
                    model.PawnedItemId = list.PawnedItemId;
                    model.PawnedItemNo = list.PawnedItemNo;
                    model.PawnedDate = list.PawnedDate;
                    model.CustomerId = list.CustomerId;
                    model.PawnedItemContractNo = list.PawnedItemContractNo;
                    model.LoanableAmount = list.LoanableAmount;
                    model.InterestRate = list.InterestRate;
                    model.InterestAmount = list.InterestAmount;
                    model.InitialPayment = list.InitialPayment;
                    model.ServiceCharge = list.ServiceCharge;
                    model.Others = list.Others;
                    model.IsInterestDeducted = list.IsInterestDeducted;
                    model.NetCashOut = list.NetCashOut;
                    model.TermsId = list.TermsId;
                    model.ScheduleOfPayment = list.ScheduleOfPayment;
                    model.NoOfPayments = list.NoOfPayments;
                    model.DueDateStart = list.DueDateStart;
                    model.DueDateEnd = list.DueDateEnd; //DateTime.Parse(list.DueDateEnd);
                    model.Status = "Pending";
                    model.IsReleased = false;
                    model.CreatedBy = "";
                    model.CreatedAt = DateTime.Now;

                    var result = await _pawningService.Save(model);
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
                    model = await _pawningService.FindById(list.PawnedItemId);
                    model.LoanableAmount = list.LoanableAmount;
                    model.InterestRate = list.InterestRate;
                    model.InterestAmount = list.InterestAmount;
                    model.InitialPayment = list.InitialPayment;
                    model.ServiceCharge = list.ServiceCharge;
                    model.Others = list.Others;
                    model.IsInterestDeducted = list.IsInterestDeducted;
                    model.NetCashOut = list.NetCashOut;
                    model.TermsId = list.TermsId;
                    model.ScheduleOfPayment = list.ScheduleOfPayment;
                    model.NoOfPayments = list.NoOfPayments;
                    model.DueDateStart = list.DueDateStart;
                    model.DueDateEnd = list.DueDateEnd;
                    model.Status = list.Status;
                    model.IsReleased = list.IsReleased;

                    var result = await _pawningService.Save(model);
                    success = result;
                    if (result)
                    {
                        message = "Successfully updated.";
                    }
                    else
                        message = "Error saving data. Please contact administrator.";
                }

                return Json(new { success = success, message = message });
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<JsonResult> UpdatePawnedItem(tbl_ipos_pawneditem list)
        {
            try
            {
                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(list.PawnedItemId.ToString()) || list.PawnedItemId.ToString() == "0")
                {
                    message = "Error saving data. Please contact administrator.";
                }
                else
                {
                    tbl_ipos_pawneditem model = null;

                    model = await _pawningService.FindById(list.PawnedItemId);
                    model.Status = list.Status;
                    model.IsReleased = list.IsReleased;

                    var result = await _pawningService.Save(model);
                    success = result;
                    if (result)
                    {
                        message = "Successfully pawned.";
                    }
                    else
                        message = "Error saving data. Please contact administrator.";
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