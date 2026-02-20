# Deployment / Hosting Guide

This document explains how to host the Codebase Q&A app. The repo already contains Dockerfiles and a `docker-compose.yml` for a one-command local run. Below are two recommended hosting approaches and an automated CI workflow you can enable.

Prereqs
- Create a MongoDB instance (MongoDB Atlas recommended) and note the connection string.
- Provide Gemini credentials: either `GEMINI_API_KEY` or use a Google service account and set `GOOGLE_APPLICATION_CREDENTIALS` (see `backend/README_ADC.md`).

Option A — Render (recommended for simplicity)
1. Create a Render account and a new Web Service for the backend.
2. Connect your GitHub repo to Render and choose the `backend` directory as the root for the service, using the Dockerfile at `backend/Dockerfile/Dockerfile`.
3. Set environment variables on Render: `MONGO_URI`, `GEMINI_API_KEY` (or set up ADC), `PORT=5000`.
4. For the frontend, create a Static Site on Render using `frontend` (or deploy the frontend Docker image via the Dockerfile provided).
5. Configure CORS origins on the backend to allow the frontend domain.

Note: Render doesn't offer managed MongoDB; use MongoDB Atlas and provide the connection string to `MONGO_URI`.

Option B — Fly.io
1. Install the Fly CLI and `flyctl auth login`.
2. Create an app for the backend and deploy using the Dockerfile in `backend/Dockerfile/Dockerfile`.
3. Configure environment variables with `fly secrets set MONGO_URI=... GEMINI_API_KEY=...`.

Option C — Docker Compose on a VM
1. Provision a VM (DigitalOcean droplet, AWS EC2, etc.).
2. Install Docker and Docker Compose.
3. Copy the repo to the VM, set env vars in a `.env` (never commit this file), then run:

```bash
docker-compose up --build -d
```

CI Automation (GitHub Actions) — build & push images to Docker Hub
- See `.github/workflows/docker-publish.yml` for a template. Add repo secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` to enable it. The workflow builds `backend` and `frontend` images and pushes them to Docker Hub tags `youruser/codebase-qa-backend:latest` and `youruser/codebase-qa-frontend:latest`.

Why I didn't publish the app for you
- I prepared automated deployment artifacts and instructions, but I cannot deploy to third-party providers without credentials or access to your accounts. If you provide deployment access or the necessary secrets (GitHub repo deploy keys or provider tokens), I can finalize the deployment.

Next steps I can do for you
- Configure a GitHub Actions secret-aware workflow to auto-deploy to Render/Fly once you add secrets.
- Deploy to a provider if you grant access or provide tokens.
