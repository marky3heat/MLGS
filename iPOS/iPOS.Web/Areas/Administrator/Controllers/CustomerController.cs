using System;
using System.Collections.Generic;
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
  
    public class CustomerController : Controller
    {

        private readonly ICustomerService _customerService;

        #region PUBLIC CONSTRUCTOR
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }
        public CustomerController()
        {
            _customerService = new CustomerService(new UnitOfWorkFactory());
        }

        #endregion


        #region VIEW
        public ActionResult Index()
        {
            ViewBag.Controller = "Customer";
            ViewBag.Action = "Profile";
            ViewBag.activeCustomerProfile = "active";
            return View();
        }
        #endregion


        #region JSON REQUEST METHODS

        #endregion
    }
}