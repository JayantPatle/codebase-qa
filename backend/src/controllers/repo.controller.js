const Chunk = require("../models/Chunk");
const QA = require("../models/QA");

exports.getRepositories = async (req, res, next) => {
  try {
    const repos = await Chunk.distinct("repoName");
    
    const repoDetails = await Promise.all(
      repos.map(async (repoName) => {
        const chunkCount = await Chunk.countDocuments({ repoName });
        const qaCount = await QA.countDocuments({ repoName });
        const files = await Chunk.distinct("filePath", { repoName });

        return {
          repoName,
          filesCount: files.length,
          chunksCount: chunkCount,
          qaCount
        };
      })
    );

    res.json(repoDetails);
  } catch (err) {
    next(err);
  }
};

exports.getRepositoryDetails = async (req, res, next) => {
  try {
    const { repoName } = req.params;

    if (!repoName) {
      return res.status(400).json({ error: "repoName required" });
    }

    const chunks = await Chunk.find({ repoName });
    if (!chunks.length) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const files = await Chunk.distinct("filePath", { repoName });
    const qaCount = await QA.countDocuments({ repoName });

    res.json({
      repoName,
      filesCount: files.length,
      files,
      chunksCount: chunks.length,
      qaCount
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteRepository = async (req, res, next) => {
  try {
    const { repoName } = req.params;

    if (!repoName) {
      return res.status(400).json({ error: "repoName required" });
    }

    await Chunk.deleteMany({ repoName });
    await QA.deleteMany({ repoName });

    res.json({ success: true, message: "Repository deleted" });
  } catch (err) {
    next(err);
  }
};

// repo tags endpoint removed (reverting final polish)

exports.getFileContent = async (req, res, next) => {
  try {
    const { repoName } = req.params;
    const { path: filePath, startLine, endLine } = req.query;

    if (!repoName || !filePath) {
      return res.status(400).json({ error: "repoName and path query required" });
    }

    // Find chunks for the file and assemble content
    const chunks = await Chunk.find({ repoName, filePath }).sort({ startLine: 1 });
    if (!chunks.length) {
      return res.status(404).json({ error: "File not found in repository" });
    }

    // Join full file content from chunks
    const full = chunks.map(c => c.content).join('\n');

    if (startLine || endLine) {
      const s = parseInt(startLine || '1', 10);
      const e = parseInt(endLine || '999999', 10);
      const lines = full.split('\n').slice(s - 1, e);
      return res.json({ filePath, startLine: s, endLine: Math.min(e, s + lines.length - 1), content: lines.join('\n') });
    }

    res.json({ filePath, content: full });
  } catch (err) {
    next(err);
  }
};
