const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload.routes");
const askRoutes = require("./routes/ask.routes");
const statusRoutes = require("./routes/status.routes");
const testRoutes = require("./routes/test.routes");
const repoRoutes = require("./routes/repo.routes");

const errorHandler = require("./utils/errorHandler");

const app = express();

// Configure CORS. Allow configuring allowed origins via FRONTEND_ORIGIN env var
// e.g. FRONTEND_ORIGIN="https://your-frontend.netlify.app,https://app.vercel.app"
// Defaults include local dev ports and the Netlify frontend URL so CORS works
// if `FRONTEND_ORIGIN` isn't set in production envs.
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://codebaseqa.netlify.app"
];
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
  : defaultOrigins;

console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow non-browser tools (curl, server-side) which send no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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

app.use("/api/upload", uploadRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/test", testRoutes);
app.use("/api/repos", repoRoutes);

app.use(errorHandler);

module.exports = app;