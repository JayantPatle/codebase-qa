const fs = require("fs");

function chunkFile(filePath) {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");

  const chunkSize = 200;
  const chunks = [];

  for (let i = 0; i < lines.length; i += chunkSize) {
    chunks.push({
      startLine: i + 1,
      endLine: Math.min(i + chunkSize, lines.length),
      content: lines.slice(i, i + chunkSize).join("\n")
    });
  }

  return chunks;
}

module.exports = chunkFile;