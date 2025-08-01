const express = require("express");
const URL = require("../models/urls");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allurls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allurls,
  });
});

router.get("/analytics", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allUrls = await URL.find({createdBy: req.user._id});
  return res.render("analytics", {
    urls: allUrls,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
