const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
  repoName: String,
  filePath: String,
  startLine: Number,
  endLine: Number,
  content: String,
});

module.exports = mongoose.model("Chunk", chunkSchema);