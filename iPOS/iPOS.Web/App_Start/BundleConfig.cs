using System.Web;
using System.Web.Optimization;

namespace iPOS.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            // knockout js bundling
            bundles.Add(new ScriptBundle("~/bundles/knockoutjs").Include(
                "~/Scripts/knockout-{version}.js"));

            // ko global
            bundles.Add(new ScriptBundle("~/bundles/ko-global").Include(
                "~/Assets/kojs/app.js",
                "~/Assets/kojs/helper.js"));

            // toastr
            bundles.Add(new StyleBundle("~/bundles/toastr-style").Include("~/Content/toastr.min.css"));
            bundles.Add(new ScriptBundle("~/bundles/toastr-script").Include("~/Scripts/toastr.min.js"));
        }
    }
}
