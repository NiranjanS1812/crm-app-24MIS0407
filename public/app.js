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
      statusDiv.innerHTML = `<strong>Customer Saved!</strong> ID: ${data.id} - ${data.name} (${data.company})`;
      document.getElementById('customerForm').reset();
    } else {
      statusDiv.className = 'status-message error';
      statusDiv.innerHTML = `<strong>Error:</strong> ${data.error || 'Failed to save customer'}`;
    }
  } catch (err) {
    statusDiv.className = 'status-message error';
    statusDiv.innerHTML = `<strong>Network Error:</strong> ${err.message}`;
  }
});
