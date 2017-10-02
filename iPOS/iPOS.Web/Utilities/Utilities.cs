using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Utilities
{
	public static class Utilities
	{
		public static string IsActiveHeader(this HtmlHelper html, string control, string action)
		{
			var routeData = html.ViewContext.RouteData;

			var routeAction = (string)routeData.Values["action"];
			var routeControl = (string)routeData.Values["controller"];

			// both must match
			var returnActive = control == routeControl &&
			                   action == routeAction;

			if ((routeControl == "Rfp" || routeControl == "Dv") && control == "Cdb")
				returnActive = true;

			if ((routeControl == "Apv" || routeControl == "ApvAdjustment") && control == "Apv")
				returnActive = true;

			if (routeControl == "Jv" && control == "Jv")
				returnActive = true;

			if ((routeControl == "Supplier" || routeControl == "Customer" || routeControl == "Employee" || routeControl == "PropertyEquip" || routeControl == "Affiliate" || routeControl == "OtherAcct" || routeControl == "Drawee") && control == "Supplier")
				returnActive = true;

			if ((routeControl == "PrimaryCode" || routeControl == "SecondaryCode" || routeControl == "AccountCode" || routeControl == "ChartOfAcct") && control == "ChartOfAcct")
				returnActive = true;

			return returnActive ? "active" : "";
		}

		public static string IsActive(this HtmlHelper html, string control, string action)
		{			
			var routeData = html.ViewContext.RouteData;

			var routeAction = (string)routeData.Values["action"];
			var routeControl = (string)routeData.Values["controller"];

			// both must match
			var returnActive = control == routeControl &&
			                   action == routeAction;

			#region Transaction Books Route Active
			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Apv" && control == "Apv"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "ApvAdjustment" && control == "ApvAdjustment"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Dv" && control == "Dv"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Rfp" && control == "Rfp"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Jv" && control == "Jv"))
				returnActive = true;
			#endregion

			#region Subsidiary Ledger Acounts Route Active
			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Supplier" && control == "Supplier"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Customer" && control == "Customer"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Employee" && control == "Employee"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "PropertyEquip" && control == "PropertyEquip"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Affiliate" && control == "Affiliate"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "OtherAcct" && control == "OtherAcct"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "Drawee" && control == "Drawee"))
				returnActive = true;
			#endregion

			#region Chart of Acounts Route Active
			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "PrimaryCode" && control == "PrimaryCode"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "SecondaryCode" && control == "SecondaryCode"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "AccountCode" && control == "AccountCode"))
				returnActive = true;

			if ((routeAction == "Create" || routeAction == "Edit" || routeAction == "Details") && (routeControl == "ChartOfAcct" && control == "ChartOfAcct"))
				returnActive = true;
			#endregion

			if (returnActive)
			{
				AppSettings.layoutsidebarcollapsed = "layout-sidebar-collapsed";
				AppSettings.sidenavcollapsed = "sidenav-collapsed";
				AppSettings.sidenavtogglercollapsed = "collapsed";
				AppSettings.ariaexpanded = false;
			}

			return returnActive ? "active" : "";
		}
	}
}