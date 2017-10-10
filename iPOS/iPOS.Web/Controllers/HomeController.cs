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


namespace iPOS.Web.Controllers
{
    public class HomeController : Controller
    {
        #region PUBLIC CONSTRUCTOR
        private readonly IPawningService _pawningService;
        private readonly IAppraisalService _appraisalService;
        private readonly ICustomerService _customerService;
        private readonly IReferenceService _referenceService;
        private readonly IPawnshopTransactionService _pawnshopTransactionService;

        public HomeController(
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
        public HomeController()
        {
            _pawningService = new PawningService(new UnitOfWorkFactory());
            _appraisalService = new AppraisalService(new UnitOfWorkFactory());
            _customerService = new CustomerService(new UnitOfWorkFactory());
            _referenceService = new ReferenceService(new UnitOfWorkFactory());
            _pawnshopTransactionService = new PawnshopTransactionService(new UnitOfWorkFactory());
        }
        #endregion

        public ActionResult Index()
        {
            ViewBag.Tag = "HOME";
            ViewBag.Title = "Home";
            ViewBag.Controller = "Home";
            ViewBag.Action = "Dashboard";

            ViewBag.UserId = "9999";
            ViewBag.Username = "Administrator";

            //Session[""] = String.Format("{0:n}", 1);
            //Session[""] = String.Format("{0:n}", 2);
            //Session[""] = String.Format("{0:n}", 3);
            GetNewTransactionsCounter();
            //return View();
            return RedirectToAction("NewTransaction", "Transactions", new { area = "Administrator" });
        }
        public ActionResult Error404()
        {
            return View();
        }
        public async Task<JsonResult> GetNewTransactionsCounter()
        {
            try
            {
                var listTransactions = await _pawnshopTransactionService.GetListPawnshopTransactions();

                var result =
                from a in listTransactions
                where a.Status != "Canceled"
                select new
                {
                    a.TransactionId
                };

                var result1 =
                from a in listTransactions
                where a.Status == "For appraisal"
                select new
                {
                    a.TransactionId
                };

                var result2 =
                from a in listTransactions
                where a.Status == "For pawning"
                select new
                {
                    a.TransactionId
                };

                var result3 =
                from a in listTransactions
                where a.Status == "For approval"
                select new
                {
                    a.TransactionId
                };

                var result4 =
                from a in listTransactions
                where a.Status == "For release"
                select new
                {
                    a.TransactionId
                };

                Session["NewTransaction"] = result.Count().ToString();
                Session["ForAppraisal"] = result1.Count().ToString();
                Session["ForPawning"] = result2.Count().ToString();
                Session["ForApproval"] = result3.Count().ToString();
                Session["ForRelease"] = result4.Count().ToString();

                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


            

        }

    }
}