using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace iPOS.Web.Repository.Interface
{
    public interface IRepository<TEntity>
    {
        Task<List<TEntity>> SqlQueryAsync(string where, params object[] args);
        IQueryable<TEntity> All { get; }
        Task<List<TEntity>> AllAsync(Expression<Func<TEntity, bool>> predicate = null);
        IEnumerable<TEntity> AllWith(params Expression<Func<TEntity, object>>[] includeProperties);
        Task<List<TEntity>> AllWithAsync(Expression<Func<TEntity, bool>> predicate = null, params Expression<Func<TEntity, object>>[] includeProperties);
        void Attach(TEntity item);
        TEntity Find(params object[] keyValues);
        Task<TEntity> FindAsync(params object[] keyValues);
        void Insert(TEntity item);
        void Update(TEntity item, params Expression<Func<TEntity, object>>[] excludeProperties);
        void Delete(TEntity item);
        void Delete(object id);
    }
}
