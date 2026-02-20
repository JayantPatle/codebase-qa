const unzipper = require("unzipper");
const fs = require("fs");
const path = require("path");
const scanDirectory = require("../utils/fileScanner");
const chunkFile = require("../services/chunk.service");
const CodeChunk = require("../models/Chunk");

exports.uploadZip = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Basic validation: require zip
    if (!req.file.originalname || !req.file.originalname.toLowerCase().endsWith('.zip')) {
      return res.status(400).json({ message: 'Uploaded file must be a .zip archive' });
    }

    const repoName = `repo_${Date.now()}`;
    const extractPath = path.join("repos", repoName);

    await fs.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    // Scan files
    const files = scanDirectory(extractPath);

    let totalChunks = 0;

    for (const file of files) {
      const chunks = chunkFile(file);

      for (const chunk of chunks) {
        await CodeChunk.create({
          repoName,
          filePath: file.replace(extractPath, ""),
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          content: chunk.content,
        });

        totalChunks++;
      }
    }
    // no repo metadata creation (removed during polish revert)

    res.json({
      success: true,
      message: "Repository processed successfully",
      repoName,
      filesProcessed: files.length,
      chunksStored: totalChunks
    });

  } catch (err) {
    next(err);
  }
};