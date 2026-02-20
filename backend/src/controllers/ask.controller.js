const { askLLM } = require("../services/llm.service");
const { retrieveRelevantChunks } = require("../services/retrieval.service");
const QA = require("../models/QA");

exports.askQuestion = async (req, res, next) => {
  try {
    const { question, repoName } = req.body;

    if (!question || !repoName) {
      return res.status(400).json({ error: "Question and repoName required" });
    }

    if (question.trim().length < 3) {
      return res.status(400).json({ error: "Question must be at least 3 characters" });
    }

    const chunks = await retrieveRelevantChunks(question, repoName);

    if (!chunks.length) {
      return res.status(404).json({ error: "No code found for this query in the repository" });
    }

    const context = chunks.map(c =>
      `File: ${c.filePath} (${c.startLine}-${c.endLine})
${c.content}`
    ).join("\n\n");

    const rawResponse = await askLLM(question, context);

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      parsed = { answer: rawResponse, references: [] };
    }

    const saved = await QA.create({
      repoName,
      question,
      answer: parsed.answer,
      references: chunks.map(c => ({
        filePath: c.filePath,
        startLine: c.startLine,
        endLine: c.endLine
      }))
    });

    // Keep only last 10 Q&As per repo
    const total = await QA.countDocuments({ repoName });
    if (total > 10) {
      const oldest = await QA.find({ repoName })
        .sort({ createdAt: 1 })
        .limit(total - 10);
      await QA.deleteMany({ _id: { $in: oldest.map(o => o._id) } });
    }

    res.json(saved);

  } catch (err) {
    next(err);
  }
};

exports.getQAHistory = async (req, res, next) => {
  try {
    const { repoName } = req.params;

    if (!repoName) {
      return res.status(400).json({ error: "repoName required" });
    }

    const qaHistory = await QA.find({ repoName })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(qaHistory);
  } catch (err) {
    next(err);
  }
};

exports.deleteQA = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID required" });
    }

    const result = await QA.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Q&A not found" });
    }

    res.json({ success: true, message: "Q&A deleted" });
  } catch (err) {
    next(err);
  }
};