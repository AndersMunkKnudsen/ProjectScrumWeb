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
    public class ProjectsController : Controller
    {
        private ScrumDBEntities db = new ScrumDBEntities();

        // GET: Projects
        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.Unauthorized);
            }
            return View(db.Projects.Where(m => m.ProjectMembers.Contains(User.Identity.Name.ToString())).ToList());
        }

        // GET: Projects/Create
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ProjectID,ProjectName,ProjectDescription,ProjectOwner, ProjectMembers")] Projects projects)
        {
            projects.ProjectID = Guid.NewGuid().ToString();
            if (ModelState.IsValid)
            {
                projects.ProjectOwner = User.Identity.Name;
                projects.ProjectMembers = projects.ProjectOwner + "," + projects.ProjectMembers;
                db.Projects.Add(projects);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(projects);
        }

        // GET: Projects/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Projects projects = db.Projects.Find(id);
            if (projects == null)
            {
                return HttpNotFound();
            }
            return View(projects);
        }

        // POST: Projects/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ProjectID,ProjectName,ProjectDescription,ProjectOwner,ProjectMembers")] Projects projects)
        {
            if (ModelState.IsValid)
            {
                db.Entry(projects).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(projects);
        }

        // GET: Projects/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Projects projects = db.Projects.Find(id);
            if (projects == null)
            {
                return HttpNotFound();
            }
            return View(projects);
        }

        [HttpPost]
        public JsonResult DeleteProject(string ProjectID)
        {
            if (ProjectID != null)
            {
                //Delete project
                Projects project = db.Projects.Find(ProjectID);
                db.Projects.Remove(project);
                db.SaveChanges();

                //Delete iterations associated with project
                List<Iterations> iterations = db.Iterations.Where(m => m.IterationProjectID == ProjectID).ToList();
                foreach (Iterations iteration in iterations)
                {
                    db.Iterations.Remove(iteration);
                    db.SaveChanges();
                }

                //Delete tasks associated with project
                List<Tasks> tasks = db.Tasks.ToList();
                foreach (Tasks task in tasks)
                {
                    if (iterations.Where(m => m.IterationName == task.IterationID).Count() > 0)
                    {
                        db.Tasks.Remove(task);
                        db.SaveChanges();
                    }

                }
                return Json(new { Msg = "Sucess" });
            }
            else
            {
                return Json(new { Msg = "Error" });
            }
        }

        // POST: Projects/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            Projects projects = db.Projects.Find(id);
            db.Projects.Remove(projects);
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
    }
}
