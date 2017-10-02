using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(iPOS.Web.Startup))]
namespace iPOS.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
