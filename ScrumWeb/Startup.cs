using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ScrumWeb.Startup))]
namespace ScrumWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
