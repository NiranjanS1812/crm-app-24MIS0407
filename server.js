const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = 'v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory customer storage
let customers = [];
let nextId = 1;

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    version: VERSION,
    timestamp: new Date().toISOString()
  });
});

// v1 Feature: Add Customer (POST /customers)
app.post('/customers', (req, res) => {
  const { name, phone, email, company } = req.body;
  if (!name || !phone || !email || !company) {
    return res.status(400).json({ error: 'All fields (name, phone, email, company) are required' });
  }

  const customer = {
    id: nextId++,
    name,
    phone,
    email,
    company
  };
  customers.push(customer);
  res.status(201).json(customer);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CRM App (${VERSION}) running on http://localhost:${PORT}`);
  });
}

module.exports = app;
