const express = require("express");
const sampleProject = require("../data/sampleProject");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    code: sampleProject,
  });
});

router.post("/", (req, res) => {
  res.json({
    success: true,
    message: "POST test endpoint working",
    received: req.body
  });
});

module.exports = router;