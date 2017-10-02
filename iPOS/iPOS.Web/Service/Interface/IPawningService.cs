using System.Collections.Generic;
using System.Threading.Tasks;
using iPOS.Web.Database;
using iPOS.Web.Models;

namespace iPOS.Web.Service.Interface
{
    public interface IPawningService
    {
        #region Pawning

        Task<tbl_ipos_pawneditem> FindById(int id);
        Task<tbl_ipos_pawneditem> FindByPawnNo(string pawnedItemNo);
        Task<List<tbl_ipos_pawneditem>> GetList(int pageIndex = 0, int pageSize = 100);
        Task<List<tbl_ipos_pawneditem>> GetNormalList();
        Task<bool> Save(tbl_ipos_pawneditem model);
        Task<bool> Update(tbl_ipos_pawneditem model);
        Task<bool> Delete(string id);
        int GetItemCode();
        int GetContractNo();

        #endregion
    }
}
