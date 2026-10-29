async function loadCustomers() {
  const tbody = document.getElementById('customerTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/customers');
    const customers = await res.json();

    if (!customers || customers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #6b7280; padding: 20px;">No customers found. Add your first customer above!</td></tr>';
      return;
    }

    tbody.innerHTML = customers.map(c => `
      <tr>
        <td><strong>#${c.id}</strong></td>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.phone)}</td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.company)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ef4444;">Failed to load customers: ${err.message}</td></tr>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

document.getElementById('customerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const statusDiv = document.getElementById('statusMessage');

  try {
    const response = await fetch('/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, company })
    });

    const data = await response.json();

    if (response.ok) {
      statusDiv.className = 'status-message success';
      statusDiv.innerHTML = `<strong>Customer Saved!</strong> ID: #${data.id} - ${data.name} (${data.company})`;
      document.getElementById('customerForm').reset();
      loadCustomers();
    } else {
      statusDiv.className = 'status-message error';
      statusDiv.innerHTML = `<strong>Error:</strong> ${data.error || 'Failed to save customer'}`;
    }
  } catch (err) {
    statusDiv.className = 'status-message error';
    statusDiv.innerHTML = `<strong>Network Error:</strong> ${err.message}`;
  }
});

document.addEventListener('DOMContentLoaded', loadCustomers);
