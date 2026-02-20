const express = require("express");
const router = express.Router();
const { 
  getRepositories, 
  getRepositoryDetails, 
  deleteRepository,
  getFileContent
} = require("../controllers/repo.controller");

router.get("/", getRepositories);
router.get("/:repoName", getRepositoryDetails);
router.delete("/:repoName", deleteRepository);
router.get('/:repoName/file', getFileContent);
// tags endpoint removed

module.exports = router;
