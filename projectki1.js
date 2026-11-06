const API_URL = 'http://localhost:5000/api';

// Switch between Login / Register tabs
function showTab(tabName) {
  document.querySelectorAll('.tab button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabName + 'Form').classList.add('active');
}

// Register new account
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById('regMsg');
  
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('regPhone').value,
        role: document.getElementById('regRole').value
      })
    });

    const data = await res.json();
    msgEl.className = `message ${res.ok ? 'success' : 'error'}`;
    msgEl.textContent = data.message;

    if (res.ok) {
      // Auto-switch to login after success
      setTimeout(() => showTab('login'), 1500);
    }
  } catch (err) {
    msgEl.className = 'message error';
    msgEl.textContent = '❌ Cannot connect to server — check if it\'s running';
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById('loginMsg');
  
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      // Save login session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      msgEl.className = 'message success';
      msgEl.textContent = `✅ Welcome, ${data.user.fullName}!`;
      
      // TODO: Redirect to dashboard page
    //   setTimeout(() => alert('🎉 Login successful! Dashboard coming next...'), 1500);
    setTimeout(() => {
    window.location.href = 'dashboard11.html';
    }, 1500);   
    } else {
      msgEl.className = 'message error';
      msgEl.textContent = data.message;
    }
  } catch (err) {
    msgEl.className = 'message error';
    msgEl.textContent = '❌ Cannot connect to server — check if it\'s running';
  }
});
