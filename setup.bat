@echo off
REM Codebase Q&A - Quick Setup Script (Windows)

echo.
echo Codebase Q&A Setup
echo ====================

REM Check Node.js
echo.
echo Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo + Node.js %NODE_VERSION%

REM Check Docker (optional)
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo + Docker is installed
) else (
    echo - Docker not found (optional for local development)
)

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

if not exist .env (
    echo   Creating .env file...
    copy .env.example .env
    echo   WARNING: Please update backend\.env with your MongoDB URI and Gemini API Key
)

echo   Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install backend dependencies
    cd ..
    exit /b 1
)

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
cd frontend

echo   Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install frontend dependencies
    cd ..
    exit /b 1
)

cd ..

echo.
echo + Setup complete!
echo.
echo Next steps:
echo ===========
echo.
echo Option 1: Local Development
echo   Terminal 1: cd backend ^&^& npm run dev
echo   Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Option 2: Docker
echo   docker-compose up --build
echo.
echo Then open your browser and navigate to:
echo   Local: http://localhost:3000
echo   Docker: http://localhost
echo.
echo Make sure to set your GEMINI_API_KEY in backend\.env before starting!
echo.
pause
