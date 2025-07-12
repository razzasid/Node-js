const express = require("express");
const URL = require("../models/urls");

const router = express.Router();

router.get("/", (req, res) => {
  return res.render("home");
});

router.get("/analytics", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("analytics", {
    urls: allUrls,
  });
});

module.exports = router;
