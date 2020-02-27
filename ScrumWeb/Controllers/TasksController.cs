﻿using System;
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
    public class TasksController : Controller
    {
        private ScrumDBEntities db = new ScrumDBEntities();

        // GET: Tasks
        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.Unauthorized);
            }
            return View(db.Tasks.Where(m => m.TaskAssignedToUser == User.Identity.Name.ToString()).ToList());
        }

        // GET: Tasks/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Tasks tasks = db.Tasks.Find(id);
            if (tasks == null)
            {
                return HttpNotFound();
            }
            return View(tasks);
        }

        // GET: Tasks/Create
        public ActionResult Create()
        {
            var users = db.Users.ToList();
            List<SelectListItem> usersList = new List<SelectListItem>();
            foreach (Users item in users)
            {
                usersList.Add(new SelectListItem
                {
                    Text = item.UserName,
                    Value = item.UserName
                });
            }
            ViewBag.Users = usersList;
            return View();
        }

        // POST: Tasks/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "TaskID,TaskName,TaskDescription,TaskStatus,TaskAssignedToUser")] Tasks tasks)
        {
            tasks.TaskID = Guid.NewGuid().ToString();

            var users = new SelectList(db.Users.ToList(), "UserName", "UserName");
            ViewData["AllUsers"] = users;

            if (ModelState.IsValid)
            {
                db.Tasks.Add(tasks);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(tasks);
        }

        // GET: Tasks/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Tasks tasks = db.Tasks.Find(id);
            if (tasks == null)
            {
                return HttpNotFound();
            }
            using (db)
            {
                var users = new SelectList(db.Users.ToList(), "UserName", "UserName");
                ViewData["AllUsers"] = users;
            }
            return View(tasks);
        }

        // POST: Tasks/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "TaskID,TaskName,TaskDescription,TaskStatus,TaskAssignedToUser")] Tasks tasks)
        {
            if (ModelState.IsValid)
            {
                db.Entry(tasks).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(tasks);
        }

        [HttpPost] 
        public JsonResult SaveWithAjax(string TaskID, string TaskName, string TaskDescription, string TaskStatus, string TaskAssignedToUser)
        {
            if (TaskID != null && TaskStatus != "")
            {
                Tasks incomingTask = new Tasks();
                incomingTask.TaskID = TaskID;
                incomingTask.TaskName = TaskName;
                incomingTask.TaskDescription = TaskDescription;
                incomingTask.TaskStatus = TaskStatus;
                incomingTask.TaskAssignedToUser = TaskAssignedToUser;

                db.Entry(incomingTask).State = EntityState.Modified;
                db.SaveChanges();
                return Json(new { Msg = "Sucess" });
            }
            else
            {
                return Json(new { Msg = "Error" });
            }           
        }
        [HttpPost]
        public JsonResult DeleteTask(string TaskID)
        {
            if (TaskID != null)
            {
                Tasks tasks = db.Tasks.Find(TaskID);
                db.Tasks.Remove(tasks);
                db.SaveChanges();
                return Json(new { Msg = "Sucess" });
            }
            else
            {
                return Json(new { Msg = "Error" });
            }
        }

        // GET: Tasks/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Tasks tasks = db.Tasks.Find(id);
            if (tasks == null)
            {
                return HttpNotFound();
            }
            return View(tasks);
        }

        // POST: Tasks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            Tasks tasks = db.Tasks.Find(id);
            db.Tasks.Remove(tasks);
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
