// Check if user is logged in
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
  // Not logged in → send back to login page
  alert('⚠️ Vui lòng đăng nhập!');
  window.location.href = 'projectmod1.html';
} else {
  // Show user info
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  if (userNameEl) userNameEl.textContent = user.fullName;
  if (userRoleEl) userRoleEl.textContent = user.role;

  // Show admin-only card if admin
  const adminCard = document.getElementById('adminOnly');
  if (adminCard && user.role === 'admin') {
    adminCard.style.display = 'block';
  }
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'projectmod1.html';
  });
}
