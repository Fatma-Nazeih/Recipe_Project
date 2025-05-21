function updateNavigation() {
    const currentUser = getCurrentUser();
    const navBar = document.querySelector('.navigation');

    if (!navBar) return;

    // Use Django-friendly paths (ensure HTML <a href="..."> matches exactly)
    const profileLink = navBar.querySelector('a[href="/profile/"]');
    const searchLink = navBar.querySelector('a[href="/search/"]');
    const favouritesLink = navBar.querySelector('a[href="/favorites/"]');
    const adminDashboardLink = navBar.querySelector('a[href="/admin-dashboard/"]');
    const userDashboardLink = navBar.querySelector('a[href="/dashboard/"]');

    const allLinks = [profileLink, searchLink, favouritesLink, adminDashboardLink, userDashboardLink];

    // Hide all initially
    allLinks.forEach(link => {
        if (link) link.style.display = 'none';
    });

    // Case 1: Logged in
    if (currentUser && typeof currentUser === 'object') {
        if (profileLink) profileLink.style.display = 'block';

        const isAdmin = String(currentUser.isAdmin).toLowerCase() === 'true';

        if (isAdmin) {
            if (adminDashboardLink) adminDashboardLink.style.display = 'block';
        } else {
            if (searchLink) searchLink.style.display = 'block';
            if (favouritesLink) favouritesLink.style.display = 'block';
            if (userDashboardLink) userDashboardLink.style.display = 'block';
        }
    }
    // Case 2: Not logged in
    else {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/accounts/login/') && !currentPath.includes('/signup/')) {
            window.location.href = '/accounts/login/';
        }
    }
}

function setupLogout() {
    const logoutLinks = document.querySelectorAll('.logout-link');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            logout();  // Must ensure this actually clears session/localStorage
            window.location.href = '/accounts/login/';
        });
    });
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    updateNavigation();
    setupLogout();
});
