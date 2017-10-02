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
    public class PawnshopTransactionService : IPawnshopTransactionService
    {
        #region PRIVATE MEMBER VARIABLES
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        #endregion

        #region PUBLIC CONSTRUCTOR
        public PawnshopTransactionService(IUnitOfWorkFactory unitOfWorkFactory)
        {
            _unitOfWorkFactory = unitOfWorkFactory;
        }
        #endregion

        #region PUBLIC MEMBER METHODS (Pawnshop Transactions)
        public async Task<bool> SavePawnshopTransactions(tbl_ipos_pawnshop_transactions model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdPawnshopTransactions(model.TransactionId);
                    if (result == null)
                    {
                        uow.PawnshopTransactionsRepository.Insert(model);
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
        public async Task<bool> UpdatePawnshopTransactions(tbl_ipos_pawnshop_transactions model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdPawnshopTransactions(model.TransactionId);
                    if (result != null)
                    {
                        uow.PawnshopTransactionsRepository.Update(model);
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
        public async Task<bool> DeletePawnshopTransactions(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.PawnshopTransactionsRepository.Delete(id);
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

        public async Task<tbl_ipos_pawnshop_transactions> FindByIdPawnshopTransactions(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.PawnshopTransactionsRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_pawnshop_transactions>> GetListPawnshopTransactions()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await uow.PawnshopTransactionsRepository.AllWithAsync(null);

                    return result.ToList();
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