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
    public class IterationsController : Controller
    {
        private ScrumDBEntities db = new ScrumDBEntities();

        // GET: Iterations
        public ActionResult Index()
        {
            return View(db.Iterations.ToList());
        }

        // GET: Iterations/Details/5
        public ActionResult Details(string id)
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

        // GET: Iterations/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Iterations/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "IterationID,IterationName,IterationDescription")] Iterations iterations)
        {
            iterations.IterationID = Guid.NewGuid().ToString();
            if (ModelState.IsValid)
            {
                db.Iterations.Add(iterations);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

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
            return View(iterations);
        }

        // POST: Iterations/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "IterationID,IterationName,IterationDescription")] Iterations iterations)
        {
            if (ModelState.IsValid)
            {
                db.Entry(iterations).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
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
    }
}