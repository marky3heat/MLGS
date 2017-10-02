using iPOS.Web.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace iPOS.Web.Repository
{
    public sealed class Repository<T> : IRepository<T>
        where T : class
    {
        DbContext _context;

        public Repository(DbContext context)
        {
            _context = context;
        }


        public Task<List<T>> SqlQueryAsync(string where, params object[] args)
        {
            return _context.Set<T>().SqlQuery(where, args).ToListAsync();
        }

        public IQueryable<T> All
        {
            get { return _context.Set<T>(); }
        }

        public Task<List<T>> AllAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate = null)
        {
            if (predicate != null)
                return _context.Set<T>().Where(predicate).ToListAsync();
            else
                return _context.Set<T>().ToListAsync();
        }

        public IEnumerable<T> AllWith(params System.Linq.Expressions.Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _context.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public Task<List<T>> AllWithAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate = null, params System.Linq.Expressions.Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = null;
            if (predicate != null)
                query = _context.Set<T>().Where(predicate);
            else
                query = _context.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return query.ToListAsync();
        }

        public void Attach(T item)
        {
            _context.Set<T>().Attach(item);
        }

        public T Find(params object[] keyValues)
        {
            return _context.Set<T>().Find(keyValues);
        }

        public Task<T> FindAsync(params object[] keyValues)
        {
            return _context.Set<T>().FindAsync(keyValues);
        }

        public void Insert(T item)
        {
            _context.Set<T>().Add(item);
        }

        public void Update(T item, params System.Linq.Expressions.Expression<Func<T, object>>[] excludeProperties)
        {
            _context.Set<T>().Attach(item);

            var entry = _context.Entry(item);
            entry.State = System.Data.Entity.EntityState.Modified;
            foreach (var excludeProperty in excludeProperties)
            {
                entry.Property(excludeProperty).IsModified = false;
            }
        }

        public void Delete(T item)
        {
            _context.Entry(item).State = EntityState.Deleted;
        }

        public void Delete(object id)
        {
            var item = _context.Set<T>().Find(id);
            if (item != null)
                _context.Set<T>().Remove(item);
        }
    }
}
