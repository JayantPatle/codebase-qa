const express = require("express");
const multer = require("multer");
const unzipper = require("unzipper");
const fs = require("fs");
const path = require("path");

const Chunk = require("../models/Chunk");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/zip' && file.mimetype !== 'application/x-zip-compressed') {
      cb(new Error('Only ZIP files are allowed'));
    } else {
      cb(null, true);
    }
  }
});

const IGNORE_FOLDERS = ["node_modules", ".git", "dist", "build", ".next", "venv", "__pycache__"];

function shouldIgnore(filePath) {
  return IGNORE_FOLDERS.some(folder => filePath.includes(path.sep + folder + path.sep) || filePath.includes(folder + path.sep));
}

function chunkFile(content, filePath, repoName) {
  const lines = content.split("\n");
  const chunks = [];

  const CHUNK_SIZE = 50;

  for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
    const chunkLines = lines.slice(i, i + CHUNK_SIZE);
    chunks.push({
      repoName,
      filePath,
      startLine: i + 1,
      endLine: i + chunkLines.length,
      content: chunkLines.join("\n"),
    });
  }

  return chunks;
}

async function scanDirectory(dir, repoName) {
  let allChunks = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (shouldIgnore(fullPath)) continue;

    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const nested = await scanDirectory(fullPath, repoName);
        allChunks = [...allChunks, ...nested];
      } else {
        if (
          fullPath.endsWith(".js") ||
          fullPath.endsWith(".ts") ||
          fullPath.endsWith(".jsx") ||
          fullPath.endsWith(".tsx") ||
          fullPath.endsWith(".py") ||
          fullPath.endsWith(".java") ||
          fullPath.endsWith(".go") ||
          fullPath.endsWith(".rs") ||
          fullPath.endsWith(".cpp") ||
          fullPath.endsWith(".c") ||
          fullPath.endsWith(".cs") ||
          fullPath.endsWith(".html") ||
          fullPath.endsWith(".css")
        ) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const chunks = chunkFile(content, fullPath.replace(path.join("uploads", repoName), ""), repoName);
          allChunks = [...allChunks, ...chunks];
        }
      }
    } catch (err) {
      console.error(`Error processing file ${fullPath}:`, err.message);
      continue;
    }
  }

  return allChunks;
}

router.post("/", upload.single("file"), async (req, res, next) => {
  console.log("[UPLOAD] POST request received");
  console.log("[UPLOAD] Headers:", req.headers);
  console.log("[UPLOAD] File:", req.file);
  console.log("[UPLOAD] Body:", req.body);
  
  try {
    if (!req.file) {
      console.log("[UPLOAD] No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const repoName = "repo_" + Date.now();
    const extractPath = path.join("uploads", repoName);

    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads", { recursive: true });
    }

    fs.mkdirSync(extractPath, { recursive: true });

    await fs
      .createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    // Clean up uploaded zip
    fs.unlinkSync(req.file.path);

    const chunks = await scanDirectory(extractPath, repoName);

    if (!chunks.length) {
      return res.status(400).json({ error: "No code files found in ZIP" });
    }

    await Chunk.insertMany(chunks);

    res.json({
      success: true,
      repoName,
      filesProcessed: new Set(chunks.map(c => c.filePath)).size,
      totalChunks: chunks.length,
      message: "Repository uploaded and processed successfully"
    });
  } catch (err) {
    // Clean up on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    next(err);
  }
});

module.exports = router;