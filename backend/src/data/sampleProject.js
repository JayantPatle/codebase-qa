const sampleProject = `
routes/authRoutes.js:
router.post("/login", ...)

middleware/authMiddleware.js:
function authenticate(req, res, next) { ... }

utils/retry.js:
async function retry(fn, retries) { ... }

services/apiService.js:
async function fetchUserData(userId) { ... }
`;

module.exports = sampleProject;