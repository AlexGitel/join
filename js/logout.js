/**
 * Logout of a user
 */
function logoutUser() {
    localStorage.setItem('activeUserStatus', 'false');
    localStorage.setItem('userId', '');
    localStorage.setItem('name', '');
    window.location.href = 'login.html';
}