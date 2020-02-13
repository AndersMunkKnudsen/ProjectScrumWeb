using ScrumWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScrumWeb.Controllers
{
    public class HomeController : Controller
    {
        private ScrumDBEntities db = new ScrumDBEntities();

        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.Unauthorized);
            }
            ViewBag.projectsCount = db.Projects.Where(m => m.ProjectMembers.Contains(User.Identity.Name.ToString())).Count().ToString();
            ViewBag.iterationsCount = db.Iterations.Count();
            ViewBag.tasksCount = db.Tasks.Count();

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}