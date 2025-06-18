// backend/healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/health',  // Sesuai dengan endpoint di app.js
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 200 && response.status === 'OK') {
        console.log('✅ Health check passed');
        process.exit(0);
      } else {
        console.log('❌ Health check failed - Invalid response');
        process.exit(1);
      }
    } catch (error) {
      console.log('❌ Health check failed - Parse error');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Health check failed - Request error:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Health check failed - Timeout');
  req.destroy();
  process.exit(1);
});

req.setTimeout(3000);
req.end();