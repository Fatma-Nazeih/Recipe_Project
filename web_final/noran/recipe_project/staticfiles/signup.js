document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');
    const profileForm = document.getElementById('profile-form');
    const completeForm = document.getElementById('complete-form');

    if (accountForm) {
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const usernameFeedback = document.getElementById('username-feedback');
        const emailFeedback = document.getElementById('email-feedback');
        const confirmPasswordFeedback = document.getElementById('confirm-password-feedback');

        [usernameFeedback, emailFeedback, confirmPasswordFeedback].forEach(feedback => {
            const validIcon = feedback.querySelector('.valid-icon');
            const invalidIcon = feedback.querySelector('.invalid-icon');
            const errorMessage = feedback.querySelector('.error-message');
            if (validIcon) validIcon.style.display = 'none';
            if (invalidIcon) invalidIcon.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
        });

        function setFeedback(input, feedback, isValid, message = '') {
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

        async function checkAvailability(input, feedback, url) {
            const value = input.value.trim();
            setFeedback(input, feedback, true);

            if (value === '') {
                setFeedback(input, feedback, false, 'This field cannot be empty.');
                return false;
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ value: value })
                });

                if (!response.ok) {
                    console.error('Availability check failed with status:', response.status);
                    setFeedback(input, feedback, false, `Server error during check: ${response.status}`);
                    return false;
                }

                const data = await response.json();
                if (data.available) {
                    setFeedback(input, feedback, true);
                    return true;
                } else {
                    setFeedback(input, feedback, false, data.message || 'Is already taken.');
                    return false;
                }
            } catch (error) {
                console.error('Error checking availability:', error);
                setFeedback(input, feedback, false, 'Could not check availability.');
                return false;
            }
        }

        function validateInputFormat(input, feedback, regex, errorMessage) {
            const value = input.value.trim();
            if (value === '') {
                setFeedback(input, feedback, false, 'This field cannot be empty.');
                return false;
            }
            if (regex.test(value)) {
                setFeedback(input, feedback, true);
                return true;
            } else {
                setFeedback(input, feedback, false, errorMessage);
                return false;
            }
        }

        usernameInput.addEventListener('input', () => {
            if(validateInputFormat(usernameInput, usernameFeedback, /^[a-zA-Z0-9_]{3,}$/, 'Username must be at least 3 characters long and contain only letters, numbers, or underscores.')) {
                checkAvailability(usernameInput, usernameFeedback, '/check-username/');
            }
        });

        emailInput.addEventListener('input', () => {
            if(validateInputFormat(emailInput, emailFeedback, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format.')) {
                checkAvailability(emailInput, emailFeedback, '/check-email/');
            }
        });

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            const strengthBars = passwordInput.parentElement.querySelectorAll('.strength-bar');
            strengthBars.forEach((bar, index) => {
                if (strength <= 1) {
                    bar.style.backgroundColor = index < strength ? '#e74c3c' : '#ecf0f1';
                } else if (strength <= 3) {
                    bar.style.backgroundColor = index < strength ? '#f39c12' : '#ecf0f1';
                } else {
                    bar.style.backgroundColor = index < strength ? '#2ecc71' : '#ecf0f1';
                }
            });

            const strengthText = passwordInput.parentElement.querySelector('.strength-text');
            if (strength <= 1) strengthText.textContent = 'Password Strength: Weak';
            else if (strength <= 3) strengthText.textContent = 'Password Strength: Medium';
            else strengthText.textContent = 'Password Strength: Strong';
        });

        confirmPasswordInput.addEventListener('input', () => {
            const value = confirmPasswordInput.value.trim();
            if (value === '') {
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Please confirm your password.');
                return;
            }

            if (value === passwordInput.value) {
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
            } else {
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Passwords do not match');
            }
        });

        accountForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isUsernameValid = validateInputFormat(usernameInput, usernameFeedback, /^[a-zA-Z0-9_]{3,}$/, 'Username must be at least 3 characters long and contain only letters, numbers, or underscores.');
            const isEmailValid = validateInputFormat(emailInput, emailFeedback, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format.');
            const isPasswordMatch = confirmPasswordInput.value === passwordInput.value && passwordInput.value.length > 0;
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, isPasswordMatch, 'Passwords do not match');

            let isUsernameAvailable = true;
            if(isUsernameValid) {
                isUsernameAvailable = await checkAvailability(usernameInput, usernameFeedback, '/check-username/');
            }
            let isEmailAvailable = true;
            if(isEmailValid) {
                isEmailAvailable = await checkAvailability(emailInput, emailFeedback, '/check-email/');
            }

            if (!isUsernameValid || !isEmailValid || !isPasswordMatch || !isUsernameAvailable || !isEmailAvailable) {
                alert('Please fix the errors in the form.');
                return;
            }

            const formData = new FormData(accountForm);
            try {
                const response = await fetch(accountForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Step 1 submission failed with status:', response.status, errorText);
                    alert(`Server error: ${response.status}. Please try again.`);
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    window.location.href = data.next_url;
                } else {
                    alert(data.error || 'An error occurred during validation.');

                    if (data.error.includes('Username')) {
                        setFeedback(usernameInput, usernameFeedback, false, data.error);
                    } else if (data.error.includes('Email')) {
                        setFeedback(emailInput, emailFeedback, false, data.error);
                    } else if (data.error.includes('password')) {
                        setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, data.error);
                    }
                }
            } catch (error) {
                console.error('An error occurred during step 1 fetch:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});