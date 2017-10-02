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

        public ActionResult TransactionList()
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
        #endregion
    }
}