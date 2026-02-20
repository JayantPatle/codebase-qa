# Codebase Q&A (Option B) - Local Run

This repository includes a minimal Codebase Q&A app integrated into the existing project under `backend` and `frontend`.

Quick start (local dev):

1. Ensure MongoDB is running and set `MONGO_URI` in `backend/.env`.
2. In `d:/codebase-qa/backend`, install deps and start server:

```powershell
cd backend
npm install
npm start
```

3. In `d:/codebase-qa/frontend`, install deps and start the dev server:

```powershell
cd frontend
npm install
npm run dev
```
 
Docker quick start (one command):

1. Ensure Docker is installed and running.
2. From repo root run:

```powershell
docker-compose up --build -d
```

This will start `mongodb`, `backend` (on port 5000) and `frontend` (on port 80).

What is implemented:
- Upload a ZIP via the frontend -> `/api/upload` (server extracts, chunks code, stores in MongoDB)
- Ask a question via the frontend -> `/api/ask` (retrieval + LLM call)
- View recent Q&A history (last 10 per repo)
- View file snippets referenced in answers
- Status page showing backend/db/llm health

What is not implemented / TODO:
- Production-ready authentication and security hardening
- Vector DB embeddings (retrieval is heuristic-based)
- Hosted deployment automation (you can use the provided Docker hints)
