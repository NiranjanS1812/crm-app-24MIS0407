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
    if (health.statusCode !== 200 || health.body.status !== 'UP' || health.body.version !== 'v2') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('✔ Health check passed');

    // 2. Smoke test: Add customer (v1 feature)
    const newCustomer = {
      name: 'Bob Johnson',
      phone: '+1-555-0200',
      email: 'bob@example.com',
      company: 'Tech Solutions'
    };
    const addRes = await request('POST', '/customers', newCustomer);
    console.log('Add customer response:', addRes.body);
    if (addRes.statusCode !== 201 || !addRes.body.id || addRes.body.name !== newCustomer.name) {
      throw new Error(`Add customer failed: ${JSON.stringify(addRes)}`);
    }
    console.log('✔ Add customer passed');

    // 3. Smoke test: View customers (v2 feature)
    const listRes = await request('GET', '/customers');
    console.log('View customers response:', listRes.body);
    if (listRes.statusCode !== 200 || !Array.isArray(listRes.body) || listRes.body.length === 0) {
      throw new Error(`View customers failed: ${JSON.stringify(listRes)}`);
    }
    console.log('✔ View customers (v2) passed');

    console.log('All tests passed successfully for v2!');
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.close(() => process.exit(1));
  }
});
