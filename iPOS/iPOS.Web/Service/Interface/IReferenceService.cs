using System.Collections.Generic;
using System.Threading.Tasks;
using iPOS.Web.Database;
using iPOS.Web.Models;

namespace iPOS.Web.Service.Interface
{
    public interface IReferenceService
    {
        #region ItemCategory
        Task<tbl_ipos_itemcategory> FindItemCategoryById(int id);

        Task<List<tbl_ipos_itemcategory>> GetItemCategoryList(int pageIndex = 0, int pageSize = 100);

        Task<bool> SaveItemCategory(tbl_ipos_itemcategory model);

        Task<bool> UpdateItemCategory(tbl_ipos_itemcategory model);

        Task<bool> DeleteItemCategory(string id);
        #endregion

        #region ItemType
        Task<tbl_ipos_itemtype> FindItemTypeById(int id);

        Task<List<tbl_ipos_itemtype>> GetItemTypeList(int pageIndex = 0, int pageSize = 100);

        Task<bool> SaveItemType(tbl_ipos_itemtype model);

        Task<bool> UpdateItemType(tbl_ipos_itemtype model);

        Task<bool> DeleteItemType(string id);
        #endregion

        #region NoGenerator
        Task<tbl_ipos_no_generator> FindByIdNoGenerator(int id);

        Task<tbl_ipos_no_generator> FindByIdAndTerminalNoGenerator(int id, string terminal);

        Task<List<tbl_ipos_no_generator>> GetListNoGenerator(int pageIndex = 0, int pageSize = 100);

        Task<bool> SaveNoGenerator(tbl_ipos_no_generator model);

        Task<bool> UpdateNoGenerator(tbl_ipos_no_generator model);

        Task<bool> DeleteNoGenerator(string id);

        string GetSelectedNoGenerator(int id, string terminal);
        #endregion

        #region Brand
        long GetItemCodeBrand();
        Task<tbl_product_brand_setup> FindByIdBrand(long id);
        Task<List<tbl_product_brand_setup>> GetListBrand(int pageIndex = 0, int pageSize = 100);
        Task<bool> SaveBrand(tbl_product_brand_setup model);
        Task<bool> UpdateBrand(tbl_product_brand_setup model);
        Task<bool> DeleteBrand(string id);
        #endregion

        #region Karat
        long GetItemCodeKarat();
        Task<tbl_ipos_karat> FindByIdKarat(long id);
        Task<List<tbl_ipos_karat>> GetListKarat(int pageIndex = 0, int pageSize = 100);
        Task<bool> SaveKarat(tbl_ipos_karat model);
        Task<bool> UpdateKarat(tbl_ipos_karat model);
        Task<bool> DeleteKarat(string id);
        #endregion

        #region Terms
        long GetItemCodeTerms();
        Task<tbl_ipos_pawneditem_terms> FindByIdTerms(long id);
        Task<List<tbl_ipos_pawneditem_terms>> GetListTerms(int pageIndex = 0, int pageSize = 100);
        Task<bool> SaveTerms(tbl_ipos_pawneditem_terms model);
        Task<bool> UpdateTerms(tbl_ipos_pawneditem_terms model);
        Task<bool> DeleteTerms(string id);
        #endregion

        #region Amortization
        Task<tbl_ipos_pawneditem_amortization_schedule> FindByIdAmortization(long id);
        Task<tbl_ipos_pawneditem_amortization_schedule> FindByTransactionNoAmortization(string transactionNo);
        Task<List<tbl_ipos_pawneditem_amortization_schedule>> GetListAmortization(int pageIndex = 0, int pageSize = 100);
        Task<bool> SaveAmortization(tbl_ipos_pawneditem_amortization_schedule model);
        Task<bool> UpdateAmortization(tbl_ipos_pawneditem_amortization_schedule model);
        Task<bool> DeleteAmortization(string id);
        #endregion
    }
}