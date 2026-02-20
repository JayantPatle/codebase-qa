# Codebase Q&A - Ask Questions About Your Code 🚀

A web application that lets you upload a codebase and ask natural language questions about it using AI-powered code analysis.

## Features

✨ **Core Features:**
- Upload any codebase as a ZIP file
- Ask questions like "Where is authentication handled?" or "How do retries work?"
- Get precise answers with file paths and line number references
- View code snippets alongside answers
- Save and manage Q&A history (last 10 per repository)
- Beautiful, intuitive UI

📊 **Additional Features:**
- System status page showing backend, database, and LLM health
- Repository management (view details, delete repos)
- Code chunk extraction (50 lines per chunk for optimal analysis)
- Support for multiple programming languages (JavaScript, Python, Java, Go, C++, C#, etc.)
- Error validation and input checking

## Tech Stack

### Backend
- **Node.js + Express** - REST API
- **MongoDB** - Data storage for code chunks and Q&As
- **Google Gemini API** - LLM for code understanding
- **Multer** - File upload handling
- **unzipper** - ZIP extraction

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling (no external CSS framework)

### DevOps
- **Docker & Docker Compose** - Containerization
# Codebase Q&A — Simple README

A minimal Codebase Q&A app that lets you upload a ZIP of a codebase and ask natural-language questions. The backend extracts code chunks, stores them in MongoDB, and uses an LLM to answer questions with file/line references.

Quick start (development)

1. Backend
   - cd backend
   - copy `.env.example` to `.env` and set `MONGO_URI` and `GEMINI_API_KEY` or configure ADC
   - npm install
   - npm run dev (server runs on port 5000)

2. Frontend
   - cd frontend
   - npm install
   - npm run dev (default Vite port)

3. Upload a ZIP in the frontend, then ask questions for the repo created.

Docker (one-command)

```powershell
docker-compose up --build -d
```

API highlights
- `POST /api/upload` — upload ZIP (multipart/form-data)
- `POST /api/ask` — ask question (JSON: { repoName, question })
- `GET /api/ask/history/:repoName` — last 10 Q&As for a repo
- `GET /api/status` — backend/db/llm health

Notes
- Do not commit real API keys. Use `.env.example` as reference.
- The retrieval is heuristic-based; consider adding embeddings for better relevance on large repos.

Contact / Maintainer
- See ABOUTME.md

License: MIT
