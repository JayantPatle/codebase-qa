#!/bin/bash

# Codebase Q&A - Quick Setup Script

echo "🚀 Codebase Q&A Setup"
echo "===================="

# Check prerequisites
echo ""
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version)"
else
    echo "⚠️  Docker not found (optional for local development)"
fi

# Setup Backend
echo ""
echo "Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "  Creating .env file..."
    cp .env.example .env
    echo "  ⚠️  Please update backend/.env with your MongoDB URI and Gemini API Key"
fi

echo "  Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "Setting up Frontend..."
cd frontend

echo "  Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "Option 1: Local Development"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Option 2: Docker"
echo "  docker-compose up --build"
echo ""
echo "Then open your browser and navigate to:"
echo "  Local: http://localhost:3000"
echo "  Docker: http://localhost"
echo ""
echo "Make sure to set your GEMINI_API_KEY in backend/.env before starting!"
