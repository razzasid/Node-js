const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirectUrl,
  handleGetUrl,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/", handleGetUrl);
router.get("/:shortId", handleRedirectUrl);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
