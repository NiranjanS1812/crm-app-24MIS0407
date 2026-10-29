let currentCustomers = [];

async function loadCustomers() {
  const tbody = document.getElementById('customerTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/customers');
    const customers = await res.json();
    currentCustomers = customers || [];

    if (!customers || customers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6b7280; padding: 20px;">No customers found. Add your first customer above!</td></tr>';
      return;
    }

    tbody.innerHTML = customers.map(c => `
      <tr>
        <td><strong>#${c.id}</strong></td>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.phone)}</td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.company)}</td>
        <td>
          <button class="btn btn-warning" onclick="openEditModal(${c.id})">Edit</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to load customers: ${err.message}</td></tr>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Add Customer (v1)
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

// Update Customer (v3)
window.openEditModal = function(id) {
  const customer = currentCustomers.find(c => c.id === id);
  if (!customer) return;

  document.getElementById('editId').value = customer.id;
  document.getElementById('editName').value = customer.name;
  document.getElementById('editPhone').value = customer.phone;
  document.getElementById('editEmail').value = customer.email;
  document.getElementById('editCompany').value = customer.company;

  document.getElementById('editModal').classList.add('active');
};

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
}

document.getElementById('closeModalBtn').addEventListener('click', closeEditModal);
document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const company = document.getElementById('editCompany').value.trim();

  try {
    const response = await fetch(`/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, company })
    });

    if (response.ok) {
      closeEditModal();
      loadCustomers();
      const statusDiv = document.getElementById('statusMessage');
      statusDiv.className = 'status-message success';
      statusDiv.innerHTML = `<strong>Customer #${id} updated successfully!</strong>`;
    } else {
      const err = await response.json();
      alert(`Update failed: ${err.error || 'Unknown error'}`);
    }
  } catch (err) {
    alert(`Update failed: ${err.message}`);
  }
});

document.addEventListener('DOMContentLoaded', loadCustomers);
