
function updateNavigation() {
    const currentUser = getCurrentUser();
    const navBar = document.querySelector('.navigation');
    
    if (!navBar) return;
    
    // Get all navigation links
    const profileLink = document.querySelector('a[href="profile.html"]');
    const searchLink = document.querySelector('a[href="http://127.0.0.1:8001/search/?q="]');
    const favouritesLink = document.querySelector('a[href="favouriteRecipe.html"]');
    const adminDashboardLink = document.querySelector('a[href="adminDashboard.html"]');
    const userDashboardLink = document.querySelector('a[href="http://127.0.0.1:8001/dashboard/"]');
    
    // Reset all links to hidden by default
    [profileLink, searchLink, favouritesLink, adminDashboardLink, userDashboardLink].forEach(link => {
        if (link) link.style.display = 'none';
    });
    
    if (currentUser) {
        // Always show these for logged-in users
        if (profileLink) profileLink.style.display = 'block';
        
        // Show appropriate dashboard
        if (currentUser.isAdmin) {
            if (adminDashboardLink) adminDashboardLink.style.display = 'block';
        } else {
            if (userDashboardLink) userDashboardLink.style.display = 'block';
            if (searchLink) searchLink.style.display = 'block';
            if (favouritesLink) favouritesLink.style.display = 'block';
        }
        
    } else {
        // Redirect to login if not on login/signup pages
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('signup.html')) {
            window.location.href = 'login.html';
        }
    }
}

function setupLogout() {
    const logoutLinks = document.querySelectorAll('.logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.href = 'login.html';
        });
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    setupLogout();
});