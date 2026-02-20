const express = require("express");
const router = express.Router();

const { askQuestion, getQAHistory, deleteQA } = require("../controllers/ask.controller");

router.post("/", askQuestion);
router.get("/history/:repoName", getQAHistory);
router.delete("/:id", deleteQA);

module.exports = router;