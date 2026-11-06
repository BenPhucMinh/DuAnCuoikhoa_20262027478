// Check if user is logged in
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || !token) {
  // Not logged in → send back to login page
  alert('⚠️ Please log in first!');
//   window.location.href = 'projectmod1.html';
window.location.href = 'dashboard11.html';
} else {
  // Show user info
  document.getElementById('userName').textContent = user.fullName;
  document.getElementById('userRole').textContent = user.role;

  // Show admin-only card if admin
  if (user.role === 'admin') {
    document.getElementById('adminOnly').style.display = 'block';
  }
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
window.location.href = 'projectmod1.html';
});
