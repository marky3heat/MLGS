using iPOS.Web.Database;
using iPOS.Web.Repository.Interface;
using iPOS.Web.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iPOS.Web.Service
{
    public class ReferenceService : IReferenceService
    {
        #region PRIVATE MEMBER VARIABLES
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        #endregion

        #region PUBLIC CONSTRUCTOR
        public ReferenceService(IUnitOfWorkFactory unitOfWorkFactory)
        {
            _unitOfWorkFactory = unitOfWorkFactory;
        }
        #endregion

        #region PUBLIC MEMBER METHODS (ITEM CATEGORY)
        public async Task<tbl_ipos_itemcategory> FindItemCategoryById(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.ItemCategoryRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_itemcategory>> GetItemCategoryList(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var itemCategList = await uow.ItemCategoryRepository.AllWithAsync(null);

                    itemCategList = itemCategList
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return itemCategList.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SaveItemCategory(tbl_ipos_itemcategory model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindItemCategoryById(model.ItemCategoryId);
                    if (result == null)
                    {
                        uow.ItemCategoryRepository.Insert(model);
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

        public async Task<bool> UpdateItemCategory(tbl_ipos_itemcategory model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindItemCategoryById(model.ItemCategoryId);
                    if (result != null)
                    {
                        uow.ItemCategoryRepository.Update(model);
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

        public async Task<bool> DeleteItemCategory(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.ItemCategoryRepository.Delete(id);
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

        #region PUBLIC MEMBER METHODS (ITEM TYPE)
        public async Task<tbl_ipos_itemtype> FindItemTypeById(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.ItemTypeRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_itemtype>> GetItemTypeList(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var itemTypeList = await uow.ItemTypeRepository.AllWithAsync(null);

                    itemTypeList = itemTypeList
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return itemTypeList.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SaveItemType(tbl_ipos_itemtype model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindItemTypeById(model.ItemTypeId);
                    if (result == null)
                    {
                        uow.ItemTypeRepository.Insert(model);
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

        public async Task<bool> UpdateItemType(tbl_ipos_itemtype model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindItemTypeById(model.ItemTypeId);
                    if (result != null)
                    {
                        uow.ItemTypeRepository.Update(model);
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

        public async Task<bool> DeleteItemType(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.ItemTypeRepository.Delete(id);
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

        #region PUBLIC MEMBER METHODS (NO GENERATOR)
        public async Task<tbl_ipos_no_generator> FindByIdNoGenerator(int id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.NoGeneratorRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<tbl_ipos_no_generator> FindByIdAndTerminalNoGenerator(int id, string terminal)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await uow.NoGeneratorRepository.AllWithAsync(u => u.NoId == id && u.Terminal == terminal);
                    return result.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<tbl_ipos_no_generator>> GetListNoGenerator(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var ListNoGenerator = await uow.NoGeneratorRepository.AllWithAsync(null);

                    ListNoGenerator = ListNoGenerator
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return ListNoGenerator.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SaveNoGenerator(tbl_ipos_no_generator model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdNoGenerator(model.NoId);
                    if (result == null)
                    {
                        uow.NoGeneratorRepository.Insert(model);
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

        public async Task<bool> UpdateNoGenerator(tbl_ipos_no_generator model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdAndTerminalNoGenerator(model.NoId, model.Terminal);
                    if (result != null)
                    {
                        uow.NoGeneratorRepository.Update(model);
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

        public async Task<bool> DeleteNoGenerator(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.NoGeneratorRepository.Delete(id);
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

        public string GetSelectedNoGenerator(int id, string terminal)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var list = uow.NoGeneratorRepository.AllWithAsync(u => u.NoId == id && u.Terminal == terminal);
                    var result = list.Result;


                    return result[0].No.ToString();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region PUBLIC MEMBER METHODS (BRAND)
        public long GetItemCodeBrand()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = uow.BrandRepository.All;
                    if (result.Count() != 0)
                    {
                        return result.Max(a => a.autonum);
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
        public async Task<tbl_product_brand_setup> FindByIdBrand(long id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.BrandRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_product_brand_setup>> GetListBrand(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var list = await uow.BrandRepository.AllWithAsync(null);

                    list = list
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return list.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SaveBrand(tbl_product_brand_setup model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdBrand(model.autonum);
                    if (result == null)
                    {
                        uow.BrandRepository.Insert(model);
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

        public async Task<bool> UpdateBrand(tbl_product_brand_setup model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdBrand(model.autonum);
                    if (result != null)
                    {
                        uow.BrandRepository.Update(model);
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

        public async Task<bool> DeleteBrand(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.BrandRepository.Delete(id);
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

        #region PUBLIC MEMBER METHODS (KARAT)
        public long GetItemCodeKarat()
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = uow.KaratRepository.All;
                    if (result.Count() != 0)
                    {
                        return result.Max(a => a.autonum);
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
        public async Task<tbl_ipos_karat> FindByIdKarat(long id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    return await uow.KaratRepository.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<tbl_ipos_karat>> GetListKarat(
            int pageIndex = 0,
            int pageSize = 100)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var list = await uow.KaratRepository.AllWithAsync(null);

                    list = list
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();

                    return list.ToList();
                }


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> SaveKarat(tbl_ipos_karat model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdKarat(model.autonum);
                    if (result == null)
                    {
                        uow.KaratRepository.Insert(model);
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

        public async Task<bool> UpdateKarat(tbl_ipos_karat model)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    var result = await FindByIdKarat(model.autonum);
                    if (result != null)
                    {
                        uow.KaratRepository.Update(model);
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

        public async Task<bool> DeleteKarat(string id)
        {
            try
            {
                using (var uow = _unitOfWorkFactory.Create())
                {
                    if (!string.IsNullOrEmpty(id))
                    {
                        uow.BrandRepository.Delete(id);
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
    }
}