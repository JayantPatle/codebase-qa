const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json && json.message && json.message.includes('Codebase Q')) {
        console.log('Health OK');
        process.exit(0);
      } else {
        console.error('Unexpected health response:', data);
        process.exit(2);
      }
    } catch (e) {
      console.error('Invalid JSON from health endpoint:', data);
      process.exit(2);
    }
  });
});

req.on('error', err => {
  console.error('Health check failed:', err.message);
  process.exit(1);
});

req.end();
