# PROMPTS_USED

Records of prompts used during development (do not include responses or secrets):

- Ask LLM: "You are analyzing a codebase to answer questions about it. Use ONLY the provided code context to answer the question. Be specific and reference exact file paths and line numbers." (used as base prompt in `llm.service.js`)

- For structured JSON answers: requested schema like `{ "answer": "...", "references": [{"filePath":"...","startLine":1,"endLine":20}] }` to make parsing reliable.
# PROMPTS_USED.md

## AI Development Prompts Used

This document records the main prompts used to generate code and architecture for the Codebase Q&A project using GitHub Copilot and Claude AI.

### Project Planning & Architecture

**Prompt 1:** Initial Project Structure
```
Create a full-stack web application for code analysis with these features:
1. Backend: Node.js Express API for uploading code repos and answering questions about them
2. Frontend: React SPA with upload page, home page, and status page
3. Database: MongoDB to store code chunks and Q&A history
4. AI: Integration with Google Gemini API for code understanding
Include proper folder structure, models, controllers, and routes.
```

**Prompt 2:** API Design
```
Design RESTful API endpoints for a code analysis system:
- Upload ZIP file with codebase
- Store code in chunks (50 lines each)
- Search functionality with relevance ranking
- Save Q&A history (max 10 per repository)
- System status checking (database, API health)
Include request/response examples and error codes.
```

### Backend Development

**Prompt 3:** Express Server Setup
```
Create an Express.js server with:
1. CORS enabled for localhost
2. JSON body parser with 50MB limit
3. Error handling middleware
4. MongoDB connection with Mongoose
5. Routes for upload, ask, status endpoints
6. Proper logging and error messages
```

**Prompt 4:** File Upload Handler
```
Implement a file upload endpoint that:
1. Accepts ZIP files only (validate MIME type)
2. Extracts ZIP to temp directory
3. Scans for code files (.js, .ts, .py, .java, etc.)
4. Ignores node_modules, .git, dist, build folders
5. Splits files into 50-line chunks
6. Stores chunks in MongoDB with repo name, file path, line numbers
7. Returns operation summary (files, chunks count)
8. Cleans up temp files
```

**Prompt 5:** Code Relevance Ranking
```
Create a search function that:
1. Finds chunks matching question keywords
2. Scores based on:
   - Exact phrase matching (high priority)
   - Word frequency matching
   - Function/class definition indicators
3. Returns top 5 chunks sorted by relevance score
4. Has fallback to return top 3 if no matches
```

**Prompt 6:** LLM Integration
```
Integrate Google Gemini 1.5 Flash API to:
1. Take a code question and relevant code snippets
2. Generate a clear answer citing specific file paths and line numbers
3. Handle API errors gracefully
4. Return plain text (not JSON) response
5. Include error handling for quota limits and network issues
```

**Prompt 7:** Q&A History Management
```
Implement database operations to:
1. Save each Q&A with question, answer, references to MongoDB
2. Enforce max 10 Q&As per repository (delete oldest when over limit)
3. Retrieve full history for a repo sorted by newest first
4. Delete individual Q&As by ID
5. Include timestamps for each entry
```

**Prompt 8:** Status Endpoint
```
Create a status page that shows:
1. Backend health (always OK if endpoint responding)
2. Database connection status and readiness state
3. LLM API configuration status (check if key exists)
4. Statistics: total chunks stored, number of unique repos
5. Return status codes 200 for health, error details if issues
```

### Frontend Development

**Prompt 9:** React App Structure
```
Create a React application with:
1. Main App.jsx with navigation between pages
2. HomePage - select repo and ask questions
3. UploadPage - ZIP file upload with progress
4. StatusPage - system health display
5. Use hooks (useState, useEffect) for state management
6. Axios for HTTP requests to backend
7. Clean, modern CSS styling (no external frameworks)
8. Mobile responsive design
```

**Prompt 10:** Upload Component
```
Create an upload form that:
1. Accepts ZIP files only (validate before sending)
2. Checks file size (max 50MB)
3. Shows selected file name and size
4. Displays upload progress or loading status
5. Shows success message with:
   - Repo ID
   - Number of files processed
   - Number of chunks created
6. Error handling for invalid file types and network errors
```

**Prompt 11:** Q&A Interface
```
Build the main Q&A interface with:
1. Dropdown to select uploaded repository
2. Text area for question input
3. Validation: at least 3 characters
4. Submit button with loading state
5. Display answer in card format
6. Show referenced code chunks in collapsible sections
7. Display file paths and line number ranges
8. Error messages for no results or API failures
```

**Prompt 12:** Status Page UI
```
Create a status monitoring page showing:
1. Backend status (green/red badge)
2. Database connection status with color coding
3. LLM API status (configured/missing)
4. Statistics cards:
   - Total repositories uploaded
   - Total code chunks indexed
5. Manual refresh button
6. Auto-refresh every 5 seconds
7. Responsive grid layout
```

### DevOps & Configuration

**Prompt 13:** Docker Setup
```
Create Dockerfiles for:
1. Backend (Node.js):
   - Alpine base image for small size
   - Copy package.json, install deps
   - Copy source code
   - Expose port 5000
   - Run with NODE_ENV=production

2. Frontend (React):
   - Multi-stage build (node for build, nginx for serve)
   - Build React app with Vite
   - Serve with nginx
   - Expose port 80
   - Proxy /api requests to backend
```

**Prompt 14:** Docker Compose
```
Create docker-compose.yml with services:
1. MongoDB:
   - Official mongo:7.0 image
   - Persistent volume for data
   - Environment variables for root user
   - Network isolation

2. Backend:
   - Build from Dockerfile
   - Environment variables for MONGO_URI and GEMINI_API_KEY
   - Depends on MongoDB
   - Volume for uploads directory
   - Port 5000 exposed

3. Frontend:
   - Build from frontend Dockerfile
   - Depends on backend
   - Port 80 exposed
   - Auto-restart policy

All services on same network for internal communication.
```

**Prompt 15:** Nginx Configuration
```
Create nginx.conf for frontend serving:
1. Listen on port 80
2. Serve compiled React files from /usr/share/nginx/html
3. Route / to index.html for SPA routing
4. Proxy /api requests to backend service on port 5000
5. Include proper cache headers
6. Set up security headers
```

### Documentation & Specifications

**Prompt 16:** Comprehensive README
```
Write a README.md that includes:
1. Project overview and features
2. Tech stack explanation
3. Quick start guide for both local and Docker setup
4. Complete API endpoint documentation with examples
5. Environment variable setup
6. File structure explanation
7. List of what's implemented vs not implemented
8. Troubleshooting guide
9. Performance notes
10. License information
```

**Prompt 17:** AI Notes Documentation
```
Create AI_NOTES.md documenting:
1. What was built with AI assistance
2. What was manually reviewed/corrected
3. Technology choices and why (vs alternatives)
4. Known limitations and future improvements
5. Testing approach
6. Security measures taken
7. Performance observations
```

**Prompt 18:** Development Process
```
Document the development workflow:
1. Start with architecture design
2. Build backend controllers and models first
3. Create API routes and test with curl/Postman
4. Build React components in parallel
5. Connect frontend to backend APIs
6. Create Docker setup for containerization
7. Write comprehensive documentation
8. Deploy and test in production environment
```

### Configuration Files

**Prompt 19:** Environment Configuration
```
Create .env.example with:
1. PORT=5000 (backend server)
2. MONGO_URI placeholder for MongoDB connection
3. GEMINI_API_KEY placeholder (note: actual key never in repo)
4. NODE_ENV setting
Include instructions for obtaining API keys.
```

### Code Quality Improvements

**Prompt 20:** Error Handling
```
Implement proper error handling throughout:
1. Validat all user inputs (empty, null, wrong type)
2. Custom error messages (not system errors to users)
3. Error middleware in Express
4. Try-catch in async functions
5. API error responses with status codes
6. Frontend error display in UI
7. Logging for debugging
```

### Testing & Validation

**Prompt 21:** Input Validation
```
Add validation for:
1. Question: min 3 chars, max 500 chars, no empty
2. File upload: ZIP only, max 50MB, required
3. Repository selection: must select one before asking
4. API responses: validate structure before display
5. Error messages: user-friendly and specific
```

---

## Prompt Techniques Used

### Effective Patterns
1. **Specific over Generic** - "Create error handling middleware for Express" (specific function, context)
2. **Requirements Listing** - Numbers each requirement for clarity and completeness
3. **Include Examples** - Ask for API examples, command line examples, code snippets
4. **State Constraints** - "Max 10 per repo", "50-line chunks" to ensure spec compliance
5. **Alternative Framing** - "Why not X?" to explain architectural decisions

### AI Improvement Tips
- Break large projects into smaller prompts
- Provide context from previous generated code
- Ask for "production-ready" code to improve quality
- Request error handling explicitly
- Ask for comments/documentation in generated code
- Iterate on initial output with refinement prompts

## Notes

- No API keys or credentials are included in these prompts
- All prompts focus on architecture and functionality
- Security and best practices were emphasized throughout
- Documentation-first approach used to explain decisions
- Code quality and maintainability prioritized

---

*These prompts demonstrate the AI-assisted approach while maintaining human oversight for quality and security.*
