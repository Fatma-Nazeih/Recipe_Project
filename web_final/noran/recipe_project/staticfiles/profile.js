document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const profileContainer = document.querySelector('.profile-container');
    const user = {
        username: profileContainer?.querySelector('#profile-name')?.textContent || '',
        email: profileContainer?.querySelector('#profile-email')?.textContent || '',
        avatar: profileContainer?.querySelector('#profile-avatar')?.src || '',
        bio: (profileContainer?.querySelector('#profile-bio')?.textContent?.trim() === 'Not provided' ? '' : profileContainer?.querySelector('#profile-bio')?.textContent?.trim()) || '',
        location: (profileContainer?.querySelector('#profile-location')?.textContent?.trim() === 'Not provided' ? '' : profileContainer?.querySelector('#profile-location')?.textContent?.trim()) || '',
        cuisineSpecialty: (profileContainer?.querySelector('#profile-cuisines')?.textContent?.trim() === 'None selected' ? '' : profileContainer?.querySelector('#profile-cuisines')?.textContent?.trim()) || '',
        joinDate: profileContainer?.querySelector('#profile-joined')?.textContent || '',
        lastLogin: profileContainer?.querySelector('#profile-last-login')?.textContent || '',
        interests: profileContainer?.querySelector('#profile-interests')?.dataset.interests || '',
        isAdmin: profileContainer?.querySelector('.admin-link')?.dataset.isAdmin === 'true' || false,
    };

    const adminLink = document.querySelector('.admin-link');
    if (user.isAdmin && adminLink) {
        adminLink.style.display = 'inline';
    }

    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
        document.getElementById('full-name').value = user.username;
        document.getElementById('edit-bio').value = user.bio;
        document.getElementById('edit-location').value = user.location;

        const editCuisinesSelect = document.getElementById('edit-cuisines');
        if (user.cuisineSpecialty) {
            const userCuisines = user.cuisineSpecialty.split(',').map(c => c.trim());
            Array.from(editCuisinesSelect.options).forEach(option => {
                if (userCuisines.includes(option.value)) {
                    option.selected = true;
                }
            });
        }
        document.getElementById('edit-interests').value = user.interests;

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(editForm);
            formData.append('action', 'update_profile');
            try {
                const response = await fetch('/profile/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Profile update failed with status:', response.status, errorText);
                    showToast(`Server error during profile update: ${response.status}`, 'error');
                    return;
                }
                const data = await response.json();
                if (data.success) {
                    document.getElementById('profile-name').textContent = formData.get('full-name');
                    document.getElementById('profile-username').textContent = '@' + formData.get('full-name');
                    document.getElementById('profile-bio').textContent = formData.get('bio') || 'Not provided';
                    document.getElementById('profile-location').textContent = formData.get('location') || 'Not provided';
                    document.getElementById('profile-interests').dataset.interests = formData.get('interests') || '';
                    const interestsContainer = document.getElementById('profile-interests');
                    interestsContainer.innerHTML = '';
                    const updatedInterests = formData.get('interests').split(',').map(i => i.trim()).filter(i => i !== '');
                    if (updatedInterests.length > 0) {
                        updatedInterests.forEach(interest => {
                            const tag = document.createElement('span');
                            tag.classList.add('interest-tag');
                            tag.innerHTML = `<i class="fas fa-heart"></i> ${interest}`;
                            interestsContainer.appendChild(tag);
                        });
                    } else {
                        interestsContainer.innerHTML = '<p>No interests added yet.</p>';
                    }
                    const selectedCuisines = Array.from(editCuisinesSelect.selectedOptions).map(option => option.value);
                    document.getElementById('profile-cuisines').textContent = selectedCuisines.length > 0 ? selectedCuisines.join(', ') : 'None selected';
                    showToast(data.message || 'Profile updated successfully!', 'success');
                    setTimeout(() => window.location.hash = 'my-profile', 1000);
                } else {
                    showToast(data.error || 'Profile update failed.', 'error');
                }
            } catch (error) {
                console.error('An error occurred during profile update fetch:', error);
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }

    const avatarForm = document.getElementById('avatar-form');
    const editModal = document.getElementById('edit-modal');
    const modalCancelBtn = editModal ? editModal.querySelector('.modal-actions .btn-secondary') : null;

    if (avatarForm && editModal) {
        const avatarEditBtn = document.querySelector('.profile-picture .edit-btn');
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', (e) => {
                const currentAvatar = document.getElementById('profile-avatar').src;
                const currentAvatarInput = avatarForm.querySelector(`input[value="${currentAvatar}"]`);
                if (currentAvatarInput) {
                    currentAvatarInput.checked = true;
                }
            });
        }
        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '';
            });
        }
        avatarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(avatarForm);
            formData.append('action', 'update_avatar');
            try {
                const response = await fetch('/profile/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Avatar update failed with status:', response.status, errorText);
                    showToast(`Server error during avatar update: ${response.status}`, 'error');
                    return;
                }
                const data = await response.json();
                if (data.success) {
                    const newAvatarUrl = formData.get('avatar');
                    document.getElementById('profile-avatar').src = newAvatarUrl;
                    document.getElementById('activity-avatar').src = newAvatarUrl;
                    showToast(data.message || 'Avatar updated successfully!', 'success');
                    setTimeout(() => {
                        window.location.hash = '';
                        window.location.hash = 'my-profile';
                    }, 1000);
                } else {
                    showToast(data.error || 'Avatar update failed.', 'error');
                }
            } catch (error) {
                console.error('An error occurred during avatar update fetch:', error);
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }

    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        const currentPasswordInput = document.getElementById('current-password');
        const newPasswordInput = document.getElementById('new-password-security');
        const confirmPasswordInput = document.getElementById('confirm-password-security');
        const currentPasswordFeedback = document.getElementById('current-password-feedback');
        const confirmPasswordFeedback = document.getElementById('confirm-password-security-feedback');
        const newPasswordStrengthMeter = newPasswordInput.parentElement.querySelector('.password-strength');

        [currentPasswordFeedback, confirmPasswordFeedback].forEach(feedback => {
            if (!feedback) return;
            const validIcon = feedback.querySelector('.valid-icon');
            const invalidIcon = feedback.querySelector('.invalid-icon');
            const errorMessage = feedback.querySelector('.error-message');
            if (validIcon) validIcon.style.display = 'none';
            if (invalidIcon) invalidIcon.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
        });

        function setPasswordFeedback(input, feedback, isValid, message = '') {
            if (!feedback) return;
            const validIcon = feedback.querySelector('.valid-icon');
            const invalidIcon = feedback.querySelector('.invalid-icon');
            const errorMessage = feedback.querySelector('.error-message');
            if (validIcon) validIcon.style.display = 'none';
            if (invalidIcon) invalidIcon.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            input.classList.remove('success', 'error');
            feedback.classList.remove('success', 'error');
            if (isValid) {
                if (validIcon) validIcon.style.display = 'inline';
                input.classList.add('success');
                feedback.classList.add('success');
            } else {
                if (invalidIcon) invalidIcon.style.display = 'inline';
                if (errorMessage) {
                    errorMessage.textContent = message;
                    errorMessage.style.display = 'block';
                }
                input.classList.add('error');
                feedback.classList.add('error');
            }
        }

        currentPasswordInput.addEventListener('input', async () => {
            const value = currentPasswordInput.value.trim();
            setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, true);
            if (value === '') {
                setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, false, 'Current password cannot be empty.');
                return;
            }
            const formData = new FormData();
            formData.append('action', 'check_password');
            formData.append('password', value);
            try {
                const response = await fetch('/profile/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Current password check failed with status:', response.status, errorText);
                    setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, false, `Server error: ${response.status}`);
                    return;
                }
                const data = await response.json();
                if (data.valid) {
                    setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, true);
                } else {
                    setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, false, 'Incorrect password');
                }
            } catch (error) {
                console.error('Error checking current password:', error);
                setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, false, 'Could not check password.');
            }
        });

        newPasswordInput.addEventListener('input', () => {
            const password = newPasswordInput.value;
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            if (newPasswordStrengthMeter) {
                const strengthBars = newPasswordStrengthMeter.querySelectorAll('.strength-bar');
                strengthBars.forEach((bar, index) => {
                    if (strength <= 1) {
                        bar.style.backgroundColor = index < strength ? '#e74c3c' : '#ecf0f1';
                    } else if (strength <= 3) {
                        bar.style.backgroundColor = index < strength ? '#f39c12' : '#ecf0f1';
                    } else {
                        bar.style.backgroundColor = index < strength ? '#2ecc71' : '#ecf0f1';
                    }
                });
                const strengthText = newPasswordStrengthMeter.querySelector('.strength-text');
                if (strength === 0) strengthText.textContent = 'Password Strength: Weak';
                else if (strength <= 1) strengthText.textContent = 'Password Strength: Weak';
                else if (strength <= 3) strengthText.textContent = 'Password Strength: Medium';
                else strengthText.textContent = 'Password Strength: Strong';
            }
            if (confirmPasswordInput.value.length > 0) {
                if (confirmPasswordInput.value === newPasswordInput.value) {
                    setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
                } else {
                    setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Passwords do not match');
                }
            } else {
                setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
            }
        });

        confirmPasswordInput.addEventListener('input', () => {
            const value = confirmPasswordInput.value.trim();
            if (value === '') {
                setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Please confirm your new password.');
                return;
            }
            if (value === newPasswordInput.value) {
                setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
            } else {
                setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Passwords do not match');
            }
        });

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPasswordValue = currentPasswordInput.value.trim();
            const newPasswordValue = newPasswordInput.value.trim();
            const confirmPasswordValue = confirmPasswordInput.value.trim();
            if (currentPasswordValue === '' || newPasswordValue === '' || confirmPasswordValue === '') {
                showToast('Please fill in all password fields.', 'error');
                return;
            }
            if (newPasswordValue !== confirmPasswordValue) {
                setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'New passwords do not match');
                showToast('New passwords do not match.', 'error');
                return;
            }
            const formData = new FormData(changePasswordForm);
            formData.append('action', 'change_password');
            try {
                const response = await fetch('/profile/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Change password failed with status:', response.status, errorText);
                    showToast(`Server error during password change: ${response.status}`, 'error');
                    return;
                }
                const data = await response.json();
                if (data.success) {
                    showToast(data.message || 'Password updated successfully!', 'success');
                    currentPasswordInput.value = '';
                    newPasswordInput.value = '';
                    confirmPasswordInput.value = '';
                    setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, true);
                    setPasswordFeedback(newPasswordInput, currentPasswordFeedback, true);
                    setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
                    setTimeout(() => window.location.href = data.redirect_url, 1000);
                } else {
                    if (data.error.includes('current password')) {
                        setPasswordFeedback(currentPasswordInput, currentPasswordFeedback, false, data.error);
                    } else if (data.error.includes('match')) {
                        setPasswordFeedback(confirmPasswordInput, confirmPasswordFeedback, false, data.error);
                    }
                    showToast(data.error || 'Password change failed.', 'error');
                }
            } catch (error) {
                console.error('An error occurred during password change fetch:', error);
                showToast('An error occurred. Please try again.', 'error');
            }
        });
    }

    const deleteAccountForm = document.getElementById('delete-account-form');
    if (deleteAccountForm) {
        deleteAccountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                const formData = new FormData();
                formData.append('action', 'delete_account');
                try {
                    const response = await fetch('/profile/', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                        },
                    });
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Delete account failed with status:', response.status, errorText);
                        showToast(`Server error during account deletion: ${response.status}`, 'error');
                        return;
                    }
                    const data = await response.json();
                    if (data.success) {
                        window.location.href = data.redirect_url;
                    } else {
                        showToast(data.error || 'Account deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error('An error occurred during account deletion fetch:', error);
                    showToast('An error occurred. Please try again.', 'error');
                }
            }
        });
    }

    const menuLinks = document.querySelectorAll('.profile-menu a');
    const profileSections = document.querySelectorAll('.profile-section');
    console.log('Menu Links:', menuLinks.length, 'Sections:', profileSections.length);

    if (menuLinks.length > 0 && profileSections.length > 0) {
        function showSection(sectionId) {
            profileSections.forEach(section => {
                section.classList.remove('active-section');
            });
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active-section');
                console.log(`Showing section: ${sectionId}`);
            } else {
                console.log(`Section ${sectionId} not found`);
            }
        }

        function setActiveMenuLink(sectionId) {
            menuLinks.forEach(link => {
                if (link.getAttribute('href').substring(1) === sectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Clicked link for section: ${link.getAttribute('href').substring(1)}`);
                const sectionId = link.getAttribute('href').substring(1);
                history.pushState(null, '', link.getAttribute('href'));
                setActiveMenuLink(sectionId);
                showSection(sectionId);
            });
        });

        const initialSectionId = window.location.hash ? window.location.hash.substring(1) : 'my-profile';
        console.log(`Initial section ID: ${initialSectionId}`);
        setActiveMenuLink(initialSectionId);
        showSection(initialSectionId);

        window.addEventListener('popstate', () => {
            const sectionId = window.location.hash ? window.location.hash.substring(1) : 'my-profile';
            console.log(`Popstate event, new section ID: ${sectionId}`);
            setActiveMenuLink(sectionId);
            showSection(sectionId);
        });
    }

    const toast = document.getElementById('toast');
    function showToast(message, type = 'info') {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('toast-success', 'toast-error', 'toast-info');
        toast.classList.add('toast', 'show', `toast-${type}`);
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});