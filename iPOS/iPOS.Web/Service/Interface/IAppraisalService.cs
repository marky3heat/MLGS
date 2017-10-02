using System.Collections.Generic;
using System.Threading.Tasks;
using iPOS.Web.Database;
using iPOS.Web.Models;

namespace iPOS.Web.Service.Interface
{
    public interface IAppraisalService
    {
        #region Appraisal
        Task<tbl_ipos_appraiseditem> FindById(int id);
        Task<List<tbl_ipos_appraiseditem>> FindByIdList(int id);

        Task<tbl_ipos_appraiseditem> FindByAppraiseNo(string appraiseNo);

        int GetAppraiseNo();

        Task<List<tbl_ipos_appraiseditem>> GetList(int pageIndex = 0, int pageSize = 100);

        Task<bool> Save(tbl_ipos_appraiseditem model);

        Task<bool> Update(tbl_ipos_appraiseditem model);

        Task<bool> Delete(string id);
        #endregion

        #region Others
        Task<List<tbl_ipos_itemtype>> GetItemTypeList();
        Task<List<tbl_ipos_itemcategory>> GetItemCategoryList();
        Task<List<tbl_ipos_itemcategory>> GetItemCategoryByItemTypeId(int ItemTypeId);

        Task<List<tbl_customer>> GetCustomerList();
        #endregion

    }
}