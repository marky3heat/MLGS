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
    public class ReferenceController : Controller
    {
        #region PUBLIC CONSTRUCTOR
        private readonly IReferenceService _referenceService;

        public ReferenceController(IReferenceService referenceService)
        {
            _referenceService = referenceService;
        }
        public ReferenceController()
        {
            _referenceService = new ReferenceService(new UnitOfWorkFactory());
        }
        #endregion

        #region VIEWS
        // GET: Administrator/Reference
        public ActionResult Index()
        {
            ViewBag.Form = "Index";
            ViewBag.Controller = "Reference";
            ViewBag.Action = "Index";

            return View();
        }
        public ActionResult Itemtype()
        {
            ViewBag.Form = "ItemType";
            ViewBag.Controller = "Reference";
            ViewBag.Action = "ItemType";

            return View();
        }
        public ActionResult Itemcategory()
        {
            ViewBag.Form = "ItemCategory";
            ViewBag.Controller = "Reference";
            ViewBag.Action = "ItemCategory";

            return View();
        }
        public ActionResult Brand()
        {
            ViewBag.Form = "Brand";
            ViewBag.Controller = "Reference";
            ViewBag.Action = "Brand";

            return View();
        }
        public ActionResult Karat()
        {
            ViewBag.Form = "Karat";
            ViewBag.Controller = "Reference";
            ViewBag.Action = "Karat";

            return View();
        }
        public ActionResult NoGenerator()
        {
            ViewBag.Form = "NoGenerator";
            ViewBag.Controller = "Reference";
            ViewBag.Action = "NoGenerator";

            return View();
        }
        #endregion

        #region Json Methods

        // GET
        [HttpGet]
        [Route("Administrator/Reference/LoadItemTypeList")]
        public async Task<JsonResult> LoadItemTypeList()
        {
            var listItemType = await _referenceService.GetItemTypeList();

            var result =
                from a in listItemType
                select a;

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Administrator/Reference/LoadItemCategoryList")]
        public async Task<JsonResult> LoadItemCategoryList()
        {
            var listItemCategory = await _referenceService.GetItemCategoryList();
            var listItemType = await _referenceService.GetItemTypeList();

            var result =
                from a in listItemCategory
                join b in listItemType on a.ItemTypeId equals b.ItemTypeId
                select new
                {
                    a.ItemCategoryId,
                    a.ItemCategoryName,
                    b.ItemTypeName
                };

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Administrator/Reference/LoadNoGeneratorList")]
        public async Task<JsonResult> LoadNoGeneratorList()
        {
            var listNoGenerator = await _referenceService.GetListNoGenerator();

            var result =
                from a in listNoGenerator
                select new
                {
                    a.NoId,
                    a.NoDescription,
                    a.No
                };

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Administrator/Reference/LoadListBrand")]
        public async Task<JsonResult> LoadListBrand()
        {
            var list = await _referenceService.GetListBrand();

            var result =
                from a in list
                select new
                {
                    a.autonum,
                    a.brand_code,
                    a.brand_desc
                };

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Administrator/Reference/LoadListKarat")]
        public async Task<JsonResult> LoadListKarat()
        {
            var list = await _referenceService.GetListKarat();

            var result =
                from a in list
                select new
                {
                    a.autonum,
                    a.karat_code,
                    a.karat_desc
                };

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetItemType()
        {
            var listItemCategory = await _referenceService.GetItemTypeList();
            var result = listItemCategory.Select(item => new tbl_ipos_itemtype()
            {
                ItemTypeId = item.ItemTypeId,
                ItemTypeName = item.ItemTypeName,
            });

            return Json(result.OrderBy(o => o.ItemTypeName), JsonRequestBehavior.AllowGet);
        }

        // POST
        [HttpPost]
        public async Task<JsonResult> SaveItemType(tbl_ipos_itemtype itemtype)
        {
            try
            {
                tbl_ipos_itemtype itemTypeModel = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(itemtype.ItemTypeId.ToString()) || itemtype.ItemTypeId.ToString() == "0")
                {
                    itemTypeModel = new tbl_ipos_itemtype();
                    itemTypeModel.ItemTypeId = itemtype.ItemTypeId;
                    itemTypeModel.ItemTypeName = itemtype.ItemTypeName;
                    itemTypeModel.CreatedBy = "";
                    itemTypeModel.CreatedAt = DateTime.Now;

                    var result = await _referenceService.SaveItemType(itemTypeModel);
                    success = result;
                    if (result)
                    {
                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
                    }
                }
                else
                {
                    itemTypeModel = await _referenceService.FindItemTypeById(itemtype.ItemTypeId);
                    itemTypeModel.ItemTypeId = itemtype.ItemTypeId;
                    itemTypeModel.ItemTypeName = itemtype.ItemTypeName;
                    itemTypeModel.CreatedBy = "";
                    itemTypeModel.CreatedAt = DateTime.Now;

                    var result = await _referenceService.UpdateItemType(itemTypeModel);
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

        [HttpPost]
        public async Task<JsonResult> SaveItemCategory(tbl_ipos_itemcategory itemcategory)
        {
            try
            {
                tbl_ipos_itemcategory itemCategoryModel = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(itemcategory.ItemCategoryId.ToString()) || itemcategory.ItemCategoryId.ToString() == "0")
                {
                    itemCategoryModel = new tbl_ipos_itemcategory();
                    itemCategoryModel.ItemTypeId = itemcategory.ItemTypeId;
                    itemCategoryModel.ItemCategoryName = itemcategory.ItemCategoryName;
                    itemCategoryModel.ItemTypeId = itemcategory.ItemTypeId;
                    itemCategoryModel.CreatedBy = "";
                    itemCategoryModel.CreatedAt = DateTime.Now;

                    var result = await _referenceService.SaveItemCategory(itemCategoryModel);
                    success = result;
                    if (result)
                    {
                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
                    }
                }
                else
                {
                    itemCategoryModel = await _referenceService.FindItemCategoryById(itemcategory.ItemCategoryId);
                    itemCategoryModel.ItemTypeId = itemcategory.ItemTypeId;
                    itemCategoryModel.ItemCategoryName = itemcategory.ItemCategoryName;
                    itemCategoryModel.ItemTypeId = itemcategory.ItemTypeId;
                    itemCategoryModel.CreatedBy = "";
                    itemCategoryModel.CreatedAt = DateTime.Now;

                    var result = await _referenceService.UpdateItemCategory(itemCategoryModel);
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

        [HttpPost]
        public async Task<JsonResult> SaveNoGenerator(tbl_ipos_no_generator noGenerator)
        {
            try
            {
                tbl_ipos_no_generator noGeneratorModel = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(noGenerator.NoId.ToString()) || noGenerator.NoId.ToString() == "0")
                {
                    noGeneratorModel = new tbl_ipos_no_generator();
                    noGeneratorModel.NoId = noGenerator.NoId;
                    noGeneratorModel.NoDescription = noGenerator.NoDescription;
                    noGeneratorModel.No = noGenerator.No;

                    var result = await _referenceService.SaveNoGenerator(noGeneratorModel);
                    success = result;
                    if (result)
                    {
                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
                    }
                }
                else
                {
                    noGeneratorModel = await _referenceService.FindByIdNoGenerator(noGeneratorModel.NoId);
                    noGeneratorModel.NoId = noGenerator.NoId;
                    noGeneratorModel.NoDescription = noGenerator.NoDescription;
                    noGeneratorModel.No = noGenerator.No;

                    var result = await _referenceService.UpdateNoGenerator(noGeneratorModel);
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

        [HttpPost]
        public async Task<JsonResult> SaveBrand(tbl_product_brand_setup model)
        {
            try
            {
                tbl_product_brand_setup brandModel = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(model.autonum.ToString()) || model.autonum.ToString() == "0")
                {
                    var code = _referenceService.GetItemCodeBrand();

                    brandModel = new tbl_product_brand_setup();
                    brandModel.brand_code = Convert.ToInt32(code + 1);
                    brandModel.brand_desc = model.brand_desc.ToUpper();

                    var result = await _referenceService.SaveBrand(brandModel);
                    success = result;
                    if (result)
                    {
                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
                    }
                }
                else
                {
                    brandModel = await _referenceService.FindByIdBrand(brandModel.autonum);
                    brandModel.brand_desc = model.brand_desc.ToUpper();

                    var result = await _referenceService.UpdateBrand(brandModel);
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

        [HttpPost]
        public async Task<JsonResult> SaveKarat(tbl_ipos_karat model)
        {
            try
            {
                tbl_ipos_karat karatModel = null;

                bool success = false;
                string message = "";

                if (string.IsNullOrEmpty(model.autonum.ToString()) || model.autonum.ToString() == "0")
                {
                    var code = _referenceService.GetItemCodeKarat();

                    karatModel = new tbl_ipos_karat();
                    karatModel.karat_code = Convert.ToInt32(code + 1);
                    karatModel.karat_desc = model.karat_desc.ToUpper();

                    var result = await _referenceService.SaveKarat(karatModel);
                    success = result;
                    if (result)
                    {
                        message = "Successfully saved.";
                    }
                    else
                    {
                        message = "Error saving data. Please contact administrator.";
                    }
                }
                else
                {
                    karatModel = await _referenceService.FindByIdKarat(karatModel.autonum);
                    karatModel.karat_desc = model.karat_desc.ToUpper();

                    var result = await _referenceService.UpdateKarat(karatModel);
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
        #endregion
    }
}