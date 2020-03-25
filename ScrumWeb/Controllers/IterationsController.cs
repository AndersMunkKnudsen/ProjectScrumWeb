using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ScrumWeb.Models;

namespace ScrumWeb.Controllers
{
    public class IterationsController : Controller
    {
        private ScrumDBEntities db = new ScrumDBEntities();

        // GET: Iterations
        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.Unauthorized);
            }
            return View(db.Iterations.ToList());
        }

        // GET: Iterations/Create
        public ActionResult Create()
        {
            var projects = db.Projects.Where(m => m.ProjectMembers.Contains(User.Identity.Name.ToString())).ToList();
            List<SelectListItem> projectsList = new List<SelectListItem>();
            foreach (Projects item in projects)
            {
                projectsList.Add(new SelectListItem
                {
                    Text = item.ProjectName,
                    Value = item.ProjectID.ToString()
                });
            }
            ViewBag.Projects = GetProjects();
            return View();
        }

        // POST: Iterations/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "IterationID,IterationName,IterationDescription,IterationStartDate,IterationEndDate,IterationProjectID")] Iterations iterations)
        {
            iterations.IterationID = Guid.NewGuid().ToString();
            if (ModelState.IsValid && Overlap(iterations) == false)
            {
                db.Iterations.Add(iterations);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.Projects = GetProjects();
            ModelState.AddModelError("", "Dates overlapping one or more current iterations.");
            return View(iterations);
        }

        // GET: Iterations/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Iterations iterations = db.Iterations.Find(id);
            if (iterations == null)
            {
                return HttpNotFound();
            }
            using (db)
            {
                var projects = new SelectList(db.Projects.Where(m => m.ProjectMembers.Contains(User.Identity.Name.ToString())).ToList(), "ProjectID", "ProjectName");
                ViewData["AllProjects"] = projects;
            }
            return View(iterations);
        }

        // POST: Iterations/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "IterationID,IterationName,IterationDescription,IterationStartDate,IterationEndDate,IterationProjectID")] Iterations iterations)
        {
            if (ModelState.IsValid && Overlap(iterations) == false)
            {
                var iterationToEdit = db.Iterations.Find(iterations.IterationID);
                iterationToEdit.IterationName = iterations.IterationName;
                iterationToEdit.IterationStartDate = iterations.IterationStartDate;
                iterationToEdit.IterationEndDate = iterations.IterationEndDate;
                iterationToEdit.IterationDescription = iterations.IterationDescription;
                iterationToEdit.IterationProjectID = iterations.IterationProjectID;
                db.SaveChanges();

                //db.Entry(iterations).State = EntityState.Modified;
                //db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.Projects = GetProjects();
            ModelState.AddModelError("", "Dates overlapping one or more current iterations.");
            return View(iterations);
        }

        // GET: Iterations/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Iterations iterations = db.Iterations.Find(id);
            if (iterations == null)
            {
                return HttpNotFound();
            }
            return View(iterations);
        }

        [HttpPost]
        public JsonResult DeleteIteration(string IterationID)
        {
            if (IterationID != null)
            {
                Iterations iteration  = db.Iterations.Find(IterationID);
                db.Iterations.Remove(iteration);
                db.SaveChanges();
                return Json(new { Msg = "Sucess" });
            }
            else
            {
                return Json(new { Msg = "Error" });
            }
        }

        // POST: Iterations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            Iterations iterations = db.Iterations.Find(id);
            db.Iterations.Remove(iterations);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        private List<SelectListItem> GetProjects()
        {
            var projects = db.Projects.Where(m => m.ProjectMembers.Contains(User.Identity.Name.ToString())).ToList();
            List<SelectListItem> projectsList = new List<SelectListItem>();
            foreach (Projects item in projects)
            {
                projectsList.Add(new SelectListItem
                {
                    Text = item.ProjectName,
                    Value = item.ProjectID.ToString()
                });
            }
            return projectsList;
        }

        private bool Overlap(Iterations iterationToCheck)
        {
            foreach (Iterations iteration in db.Iterations)
            {
                // check if new/edited iteration start date is after each existing end dates.
                if (iterationToCheck.IterationStartDate < iteration.IterationEndDate || iterationToCheck.IterationEndDate < iterationToCheck.IterationStartDate)
                {
                    if (iterationToCheck.IterationID == iteration.IterationID)
                    {
                        continue;
                    }
                    return true;
                }
            }
            return false;
        }

        [HttpPost]
        public JsonResult CreateTemplateIteration(List<string> todo = null, List<string> inProgress = null, List<string> done = null)
        {
            try
            {
                Iterations templateIteration = new Iterations();
                string newIterationID = Guid.NewGuid().ToString();
                templateIteration.IterationID = newIterationID;
                templateIteration.IterationName = newIterationID;
                templateIteration.IterationDescription = "TEMPLATE ITERATION";
                templateIteration.IterationEndDate = DateTime.Now;
                templateIteration.IterationEndDate = DateTime.Today.AddDays(5);
                db.Iterations.Add(templateIteration);
                db.SaveChanges();

                return Json(new { Msg = newIterationID });
            }
            catch (Exception)
            {
                return Json(new { Msg = "Error" });
            }
        }
    }
}