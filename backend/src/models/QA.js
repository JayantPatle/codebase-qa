const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema(
  {
    repoName: String,
    question: String,
    answer: String,
    references: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("QA", qaSchema);