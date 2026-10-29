const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = 'v3';

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

// v2 Feature: View Customers (GET /customers)
app.get('/customers', (req, res) => {
  res.status(200).json(customers);
});

// v3 Feature: Update Customer (PUT /customers/:id)
app.put('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, phone, email, company } = req.body;

  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ error: `Customer with ID ${id} not found` });
  }

  if (name !== undefined) customers[customerIndex].name = name;
  if (phone !== undefined) customers[customerIndex].phone = phone;
  if (email !== undefined) customers[customerIndex].email = email;
  if (company !== undefined) customers[customerIndex].company = company;

  res.status(200).json(customers[customerIndex]);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CRM App (${VERSION}) running on http://localhost:${PORT}`);
  });
}

module.exports = app;
