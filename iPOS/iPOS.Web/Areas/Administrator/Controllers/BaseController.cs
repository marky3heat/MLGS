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
    public class BaseController : Controller
    {
        #region PUBLIC CONSTRUCTOR
        private readonly IPawningService _pawningService;
        private readonly IAppraisalService _appraisalService;
        private readonly ICustomerService _customerService;
        private readonly IReferenceService _referenceService;
        private readonly IPawnshopTransactionService _pawnshopTransactionService;

        public BaseController(
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
        public BaseController()
        {
            _pawningService = new PawningService(new UnitOfWorkFactory());
            _appraisalService = new AppraisalService(new UnitOfWorkFactory());
            _customerService = new CustomerService(new UnitOfWorkFactory());
            _referenceService = new ReferenceService(new UnitOfWorkFactory());
            _pawnshopTransactionService = new PawnshopTransactionService(new UnitOfWorkFactory());
        }
        #endregion

        #region VIEW

        // GET: Administrator/Base
        public ActionResult Index()
        {
            return View();
        }

        #endregion

        #region JSON REQUEST METHODS

        public async Task<JsonResult> GetCustomer()
        {
            var listCustomer = await _customerService.GetCustomerList();
            var result = listCustomer.Select(item => new tbl_customer()
            {
                autonum = item.autonum,
                first_name = item.first_name + " " + item.last_name,
                last_name = item.last_name
            });

            return Json(result.OrderBy(o => o.last_name), JsonRequestBehavior.AllowGet);
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
                    model = new tbl_customer();
                    model.first_name = list.first_name;
                    model.last_name = list.last_name;
                    model.middle_name = list.middle_name;
                    model.st_address = list.st_address;
                    model.mobile_no = list.mobile_no;
                    model.city_address = list.city_address;
                    model.zip_code = list.zip_code;

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
                    model.city_address = list.city_address;
                    model.zip_code = list.zip_code;

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

        public async Task<JsonResult> GetCustomerById(int CustomerId)
        {
            var listCustomer = await _customerService.FindByIdCustomer(CustomerId);

            return Json(listCustomer, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetItemType()
        {
            var list = await _appraisalService.GetItemTypeList();
            var result = list.Select(item => new tbl_ipos_itemtype()
            {
                ItemTypeId = item.ItemTypeId,
                ItemTypeName = item.ItemTypeName
            });

            return Json(result.OrderBy(o => o.ItemTypeName), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> GetItemCategory(int ItemTypeId)
        {
            var list = await _appraisalService.GetItemCategoryByItemTypeId(ItemTypeId);
            var result = list.Select(item => new tbl_ipos_itemcategory()
            {
                ItemCategoryId = item.ItemCategoryId,
                ItemCategoryName = item.ItemCategoryName,
                ItemTypeId = item.ItemTypeId
            });

            return Json(result.OrderBy(o => o.ItemCategoryName), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetBrand()
        {
            var list = await _referenceService.GetListBrand();
            var result = list.Select(item => new tbl_product_brand_setup()
            {
                autonum = item.autonum,
                brand_code = item.brand_code,
                brand_desc = item.brand_desc
            });

            return Json(result.OrderBy(o => o.brand_desc), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetKarat()
        {
            var list = await _referenceService.GetListKarat();
            var result = list.Select(item => new tbl_ipos_karat()
            {
                autonum = item.autonum,
                karat_code = item.karat_code,
                karat_desc = item.karat_desc
            });

            return Json(result.OrderBy(o => o.karat_desc), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetServerDate()
        {
            var serverDate = DateTime.Now.ToString("MM/dd/yyyy");

            return Json(serverDate, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTransactionNo()
        {
            var result = _referenceService.GetSelectedNoGenerator(1, "1");

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetNewTransactionsCounter()
        {
            var listTransactions = await _pawnshopTransactionService.GetListPawnshopTransactions();

            var result =
            from a in listTransactions
            where a.Status != "Canceled" || a.Status != "Pending"
            select new
            {
                a.TransactionId
            };

            var count = result.Count();

            return Json(count, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }

}