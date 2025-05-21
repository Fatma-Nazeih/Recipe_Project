const usersKey = 'recipeAppUsers';
const currentUserKey = 'recipeAppCurrentUser';

function hashPassword(password) {
    return btoa(unescape(encodeURIComponent(password))); 
}

function registerUser(username, email, password, role) {
    let users = JSON.parse(localStorage.getItem(usersKey)) || [];
    
    // Validate unique username and email
    if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
    }
    if (users.some(u => u.username === username)) {
        throw new Error('Username already taken');
    }
    
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashPassword(password),
        isAdmin: role === 'admin',
        avatar: 'https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg',
        favorites: [],
        joinDate: new Date().toISOString(),
        location: '',
        bio: '',
        cuisineSpecialty: [],
        isVerified: false,
        lastLogin: null,
        stats: {
            recipesAdded: 0,
            favoritesCount: 0,
            followers: 0,
            following: 0
        }
    };
    
    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));
    setCurrentUser(newUser);
    
    return newUser;
}

function loginUser(identifier, password) {
    const users = JSON.parse(localStorage.getItem('recipeAppUsers')) || [];
    
    // Find user by email or username
    const user = users.find(u => 
        (u.email === identifier || u.username === identifier)
    );
    
    if (!user) {
        console.error('User not found');
        throw new Error('Invalid credentials');
    }
    
    // Compare hashed passwords using same method
    const hashedInput = btoa(unescape(encodeURIComponent(password)));
    
    console.log('Stored hash:', user.password);
    console.log('Input hash:', hashedInput);
    
    if (user.password !== hashedInput) {
        console.error('Password mismatch');
        throw new Error('Invalid credentials');
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    updateUser(user);
    setCurrentUser(user);
    
    return user;
}

function resetPassword(token, newPassword) {
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const userIndex = users.findIndex(u => 
        u.resetToken === token && 
        u.resetTokenExpiry > Date.now()
    );
    
    if (userIndex === -1) return false;
    
    // Update the password
    users[userIndex].password = hashPassword(newPassword);
    users[userIndex].resetToken = null;
    users[userIndex].resetTokenExpiry = null;
    
    localStorage.setItem(usersKey, JSON.stringify(users));
    localStorage.removeItem('resetToken');
    localStorage.removeItem('resetEmail');
    
    return true;
}

function setCurrentUser(user) {
    localStorage.setItem(currentUserKey, JSON.stringify(user));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(currentUserKey));
}

function logout() {
    localStorage.removeItem(currentUserKey);
}

function updateUser(updatedUser) {
    let users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(usersKey, JSON.stringify(users));
        return true;
    }
    return false;
}

function requestPasswordReset(email) {
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const user = users.find(u => u.email === email);
    if (!user) return false;
    
    // Generate a token and set expiry (1 hour)
    const resetToken = `reset-${Date.now()}`;
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    updateUser(user);
    
    localStorage.setItem('resetToken', resetToken);
    localStorage.setItem('resetEmail', email);
    
    return true;
}


// Check if password reset token is valid
function isValidResetToken(token) {
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const user = users.find(u => 
        u.resetToken === token && 
        u.resetTokenExpiry > Date.now()
    );
    return !!user;
}

// Additional utility functions
function isLoggedIn() {
    return !!getCurrentUser();
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.isAdmin;
}
// Add these to auth.js
function getResetToken() {
    return localStorage.getItem('resetToken');
}

function clearResetToken() {
    localStorage.removeItem('resetToken');
}