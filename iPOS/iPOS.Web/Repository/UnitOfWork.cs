using System.Data.Entity;
using iPOS.Web.Repository.Interface;
using iPOS.Web.Database;
using iPOS.Web.Models;

namespace iPOS.Web.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        //private SagepmDBContext _dbContext;
        private dbpawnshopEntities _dbContext;

        public UnitOfWork()
        {
            _dbContext = new dbpawnshopEntities();
        }

        //General tables   
        private Repository<tbl_customer> _customerRepository;
        public IRepository<tbl_customer> CustomerRepository
        {
            get
            {
                if (_customerRepository == null)
                    _customerRepository = new Repository<tbl_customer>(_dbContext);
                return _customerRepository;
            }
        }
        private Repository<tbl_product_brand_setup> _brandRepository;
        public IRepository<tbl_product_brand_setup> BrandRepository
        {
            get
            {
                if (_brandRepository == null)
                    _brandRepository = new Repository<tbl_product_brand_setup>(_dbContext);
                return _brandRepository;
            }
        }
        private Repository<tbl_ipos_karat> _karatRepository;
        public IRepository<tbl_ipos_karat> KaratRepository
        {
            get
            {
                if (_karatRepository == null)
                    _karatRepository = new Repository<tbl_ipos_karat>(_dbContext);
                return _karatRepository;
            }
        }

        //Pawnshop tables
        private Repository<tbl_ipos_no_generator> _noGeneratorRepository;
        public IRepository<tbl_ipos_no_generator> NoGeneratorRepository
        {
            get
            {
                if (_noGeneratorRepository == null)
                    _noGeneratorRepository = new Repository<tbl_ipos_no_generator>(_dbContext);
                return _noGeneratorRepository;
            }
        }
        private Repository<tbl_ipos_pawnshop_transactions> _pawnshopTransactionRepository;
        public IRepository<tbl_ipos_pawnshop_transactions> PawnshopTransactionsRepository
        {
            get
            {
                if (_pawnshopTransactionRepository == null)
                    _pawnshopTransactionRepository = new Repository<tbl_ipos_pawnshop_transactions>(_dbContext);
                return _pawnshopTransactionRepository;
            }
        }
        private Repository<tbl_ipos_appraiseditem> _appraisedItemRepository;
        public IRepository<tbl_ipos_appraiseditem> AppraisedItemRepository
        {
            get
            {
                if (_appraisedItemRepository == null)
                    _appraisedItemRepository = new Repository<tbl_ipos_appraiseditem>(_dbContext);
                return _appraisedItemRepository;
            }
        }
        private Repository<tbl_ipos_pawneditem> _pawnedItemRepository;
        public IRepository<tbl_ipos_pawneditem> PawnedItemRepository
        {
            get
            {
                if (_pawnedItemRepository == null)
                    _pawnedItemRepository = new Repository<tbl_ipos_pawneditem>(_dbContext);
                return _pawnedItemRepository;
            }
        }
        private Repository<tbl_ipos_itemcategory> _itemCategoryRepository;
        public IRepository<tbl_ipos_itemcategory> ItemCategoryRepository
        {
            get
            {
                if (_itemCategoryRepository == null)
                    _itemCategoryRepository = new Repository<tbl_ipos_itemcategory>(_dbContext);
                return _itemCategoryRepository;
            }
        }
        private Repository<tbl_ipos_itemtype> _itemTypeRepository;
        public IRepository<tbl_ipos_itemtype> ItemTypeRepository
        {
            get
            {
                if (_itemTypeRepository == null)
                    _itemTypeRepository = new Repository<tbl_ipos_itemtype>(_dbContext);
                return _itemTypeRepository;
            }
        }


        public void Dispose()
        {
            _dbContext.Dispose();
        }

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public System.Threading.Tasks.Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

        public System.Threading.Tasks.Task MaxAsync()
        {
            return _dbContext.tbl_ipos_appraiseditem.MaxAsync(a => a.AppraiseId);
        }
        //#endregion        
    }
}
