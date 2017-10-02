using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static AccountingSystem.Utilities.AppSettings;

namespace AccountingSystem.Utilities
{
	/// <summary>
	/// MVC attribute to decrypt parameters- make sure that secret is the same as in
	/// <see cref="UrLExtensions.ActionEnc(UrlHelper, string, string, object)" /> or    
	/// </summary>
	public class MVCDecryptFilterAttribute : ActionFilterAttribute
	{
		/// <summary>
		/// the encrypt decrypt full class name
		/// must inherit from <see cref="IEncryptDecrypt"/>
		/// </summary>
		public string EncDecFullClassName;
		/// <summary>
		/// the secret . Should be the same as in
		/// &lt;a href='@Url.Action("TestEncrypt", new { a = 1, b = "asd" })'&gt;Test&lt;/a&gt;
		/// </summary>
		public string secret;
		/// <summary>
		/// executes and decrypts
		/// </summary>
		/// <param name="filterContext"></param>
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			IEncryptDecrypt encDec;
			var uri = filterContext.HttpContext.Request.QueryString.ToString();
			var id = uri.Split('&')[0].Split('=')[1];
			var localport = filterContext.HttpContext.Request.Url.Authority;

			if (string.IsNullOrWhiteSpace(EncDecFullClassName))
			{
				encDec = new EncryptDecrypt(secret);
				_helper.RequestContext.HttpContext = filterContext.HttpContext;
				_helper.RequestContext.RouteData = filterContext.RouteData;
				UrLExtensions.ActionEnc(_helper, encDec, filterContext.ActionDescriptor.ActionName, _routeValues);
			}
			else
			{
				var t = Type.GetType(EncDecFullClassName);
				encDec = Activator.CreateInstance(t) as IEncryptDecrypt;
				if (encDec == null)
				{
					throw new ArgumentException(" Cannot convert " + EncDecFullClassName + " to IEncryptDecrypt");
				}
			}

			string url = _param.ToString();
			var param = url.Split('?')[1];
			url.Replace("/3?", "/" + id + "?");

			var args = HttpUtility.ParseQueryString("?" + param);
			var parametersAction = filterContext.ActionDescriptor.GetParameters();
			for (int i = 0; i < args.Count; i++)
			{
				var value = args[i];
				var name = args.GetKey(i);
				var type = parametersAction.First(it => it.ParameterName == name).ParameterType;
				filterContext.ActionParameters[name] = Convert.ChangeType(encDec.DecryptString(value), type);
			}


			base.OnActionExecuting(filterContext);
		}
	}
}
