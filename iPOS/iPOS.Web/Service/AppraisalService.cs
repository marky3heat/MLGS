using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using iPOS.Web.Database;
using iPOS.Web.Models;
using iPOS.Web.Repository.Interface;
using iPOS.Web.Service.Interface;
using Microsoft.Ajax.Utilities;

namespace iPOS.Web.Service
{
    public class AppraisalService : IAppraisalService
    {
        #region PRIVATE MEMBER VARIABLES
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        #endregion

        #region PUBLIC CONSTRUCTOR
        public AppraisalService(IUnitOfWorkFactory unitOfWorkFactory)
        {
            _unitOfWorkFactory = unitOfWorkFactory;
        }
        #endregion

        #region PUBLIC MEMBER METHODS (APPRAISED ITEMS)
        public async Task<tbl_ipos_appraiseditem> FindById(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.AppraisedItemRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        
        public async Task<List<tbl_ipos_appraiseditem>> FindByIdList(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await uow.AppraisedItemRepository.AllWithAsync(u => u.AppraiseId == id);
                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<tbl_ipos_appraiseditem> FindByAppraiseNo(string appraiseNo)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await uow.AppraisedItemRepository.AllWithAsync(u => u.AppraiseNo == appraiseNo);
                    return result.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public int GetAppraiseNo()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = uow.AppraisedItemRepository.All;
                    if (result.Count() != 0)
                    {
                        return result.Max(a => a.AppraiseId);
                    }
                    else
                    {
                        return 0;
                    }           
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_appraiseditem>> GetList(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var appraiselist = await uow.AppraisedItemRepository.AllWithAsync(null);

                    appraiselist = appraiselist
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return appraiselist.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> Save(tbl_ipos_appraiseditem model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindById(model.AppraiseId);
                    if (result == null)
                    {
                        uow.AppraisedItemRepository.Insert(model);
                        await uow.SaveChangesAsync();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> Update(tbl_ipos_appraiseditem model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindById(model.AppraiseId);
                    if (result != null)
                    {
                        uow.AppraisedItemRepository.Update(model);
                        await uow.SaveChangesAsync();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> Delete(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.AppraisedItemRepository.Delete(id);
                        await uow.SaveChangesAsync();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region OTHERS
        public async Task<List<tbl_ipos_itemtype>> GetItemTypeList()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var list = await uow.ItemTypeRepository.AllWithAsync(null);
                    return list.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_itemcategory>> GetItemCategoryList()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var list = await uow.ItemCategoryRepository.AllWithAsync(null);
                    return list.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_itemcategory>> GetItemCategoryByItemTypeId(int ItemTypeId)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await uow.ItemCategoryRepository.AllWithAsync(u => u.ItemTypeId == ItemTypeId);
                    return result.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_customer>> GetCustomerList()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var list = await uow.CustomerRepository.AllWithAsync(null);
                    return list.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion
    }
}