namespace iPOS.Web.Repository.Interface
{
    public interface IUnitOfWorkFactory
    {
        IUnitOfWork Create();
        TUnitUofWork Create<TUnitUofWork>() where TUnitUofWork : IUnitOfWork;
        TUnitUofWork Create<TUnitUofWork>(string connectionString) where TUnitUofWork : IUnitOfWork;
    }
}
