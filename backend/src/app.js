const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload.routes");
const askRoutes = require("./routes/ask.routes");
const statusRoutes = require("./routes/status.routes");
const testRoutes = require("./routes/test.routes");
const repoRoutes = require("./routes/repo.routes");

const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(cors({
  origin: "https://codebase-qa-frontend.vercel.app",        // Automatically allow request origin
  credentials: false,                                      // No cookies or credentials needed
}));

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Debug logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Codebase Q&A API Running 🚀",
    version: "1.0.0",
    endpoints: {
      upload: "POST /api/upload",
      ask: "POST /api/ask",
      history: "GET /api/ask/history/:repoName",
      status: "GET /api/status",
      repos: "GET /api/repos",
      test: "GET /api/test"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/test", testRoutes);
app.use("/api/repos", repoRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;