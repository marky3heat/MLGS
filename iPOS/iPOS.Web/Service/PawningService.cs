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
    public class PawningService : IPawningService
    {
        #region PRIVATE MEMBER VARIABLES
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        #endregion

        #region PUBLIC CONSTRUCTOR
        public PawningService(IUnitOfWorkFactory unitOfWorkFactory)
        {
            _unitOfWorkFactory = unitOfWorkFactory;
        }
        #endregion

        #region PUBLIC MEMBER METHODS (PAWNED ITEMS)
        public async Task<tbl_ipos_pawneditem> FindById(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.PawnedItemRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<tbl_ipos_pawneditem> FindByPawnNo(string pawnedItemNo)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await uow.PawnedItemRepository.AllWithAsync(u => u.PawnedItemNo == pawnedItemNo);
                    return result.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_pawneditem>> GetList(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var customerlist = await uow.PawnedItemRepository.AllWithAsync(null);

                    customerlist = customerlist
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return customerlist.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_pawneditem>> GetNormalList()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var customerlist = await uow.PawnedItemRepository.AllWithAsync();

                    return customerlist.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> Save(tbl_ipos_pawneditem model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByPawnNo(model.PawnedItemNo);
                    if (result == null)
                    {
                        uow.PawnedItemRepository.Insert(model);
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
        public async Task<bool> Update(tbl_ipos_pawneditem model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindById(model.PawnedItemId);
                    if (result != null)
                    {
                        uow.PawnedItemRepository.Update(model);
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
                        uow.PawnedItemRepository.Delete(id);
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

        public int GetItemCode()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = uow.PawnedItemRepository.All;
                    if (result.Count() != 0)
                    {
                        return result.Max(a => a.PawnedItemId);
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
        public int GetContractNo()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = uow.PawnedItemRepository.All;
                    if (result.Count() != 0)
                    {
                        return result.Max(a => a.PawnedItemId);
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
        #endregion
    }
}