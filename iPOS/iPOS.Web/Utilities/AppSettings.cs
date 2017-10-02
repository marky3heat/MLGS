using System.Web.Mvc;

namespace AccountingSystem.Utilities
{
	public static class AppSettings
	{
		public static object _routeValues;
		public static UrlHelper _helper;
		public static object _param;

		public static string loginName;
		public static string userRole;
		public static string layoutsidebarcollapsed = "layout-sidebar-collapsed";
		public static string sidenavtogglercollapsed = "collapsed";
		public static bool ariaexpanded = false;
		public static string sidenavcollapsed = "sidenav-collapsed";
	}
}