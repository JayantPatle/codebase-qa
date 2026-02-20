const fs = require("fs");
const path = require("path");

const ALLOWED_EXTENSIONS = [
  ".js", ".ts", ".jsx", ".tsx",
  ".py", ".java", ".go",
  ".c", ".cpp", ".cs",
  ".html", ".css"
];

const IGNORE_FOLDERS = [
  "node_modules",
  ".git",
  "dist",
  "build"
];

function scanDirectory(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_FOLDERS.includes(file)) {
        scanDirectory(fullPath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }

  return fileList;
}

module.exports = scanDirectory;