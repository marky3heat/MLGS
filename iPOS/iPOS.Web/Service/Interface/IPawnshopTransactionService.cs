using System.Collections.Generic;
using System.Threading.Tasks;
using iPOS.Web.Database;
using iPOS.Web.Models;

namespace iPOS.Web.Service.Interface
{
    public interface IPawnshopTransactionService
    {
        #region  PawnhopTransactions
        Task<bool> SavePawnshopTransactions(tbl_ipos_pawnshop_transactions model);
        Task<bool> UpdatePawnshopTransactions(tbl_ipos_pawnshop_transactions model);
        Task<bool> DeletePawnshopTransactions(string id);

        Task<tbl_ipos_pawnshop_transactions> FindByIdPawnshopTransactions(int id);
        Task<List<tbl_ipos_pawnshop_transactions>> GetListPawnshopTransactions();
        #endregion

    }
}
