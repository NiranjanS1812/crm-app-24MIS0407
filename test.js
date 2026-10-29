const http = require('http');
const app = require('./server');

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Running smoke tests on port ${port}...`);

  function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const req = http.request({
        hostname: '127.0.0.1',
        port: port,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
        }
      }, (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(responseBody) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: responseBody });
          }
        });
      });
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  }

  try {
    // 1. Smoke test: Health Check
    const health = await request('GET', '/health');
    console.log('Health check response:', health.body);
    if (health.statusCode !== 200 || health.body.status !== 'UP' || health.body.version !== 'v1') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('✔ Health check passed');

    // 2. Smoke test: Add customer (v1)
    const newCustomer = {
      name: 'Alice Smith',
      phone: '+1-555-0100',
      email: 'alice@example.com',
      company: 'Innovatech'
    };
    const addRes = await request('POST', '/customers', newCustomer);
    console.log('Add customer response:', addRes.body);
    if (addRes.statusCode !== 201 || !addRes.body.id || addRes.body.name !== newCustomer.name) {
      throw new Error(`Add customer failed: ${JSON.stringify(addRes)}`);
    }
    console.log('✔ Add customer (v1) passed');

    console.log('All tests passed successfully for v1!');
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.close(() => process.exit(1));
  }
});
