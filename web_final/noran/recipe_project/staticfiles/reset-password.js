document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    if(!form) return;

    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPasswordFeedback = document.getElementById('confirm-password-feedback');
    const newPasswordStrengthMeter = newPasswordInput ? newPasswordInput.parentElement.querySelector('.password-strength') : null;

    if(!newPasswordInput || !confirmPasswordInput || !confirmPasswordFeedback) {
        console.error("Missing required elements for reset password form.");
        return;
    }

    const validIcon = confirmPasswordFeedback.querySelector('.valid-icon');
    const invalidIcon = confirmPasswordFeedback.querySelector('.invalid-icon');
    const errorMessage = confirmPasswordFeedback.querySelector('.error-message');

    if (validIcon) validIcon.style.display = 'none';
    if (invalidIcon) invalidIcon.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    function setFeedback(input, feedback, isValid, message = '') {
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

        if(confirmPasswordInput.value.length > 0) {
            if (confirmPasswordInput.value === newPasswordInput.value) {
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
            } else {
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Passwords do not match');
            }
        } else {
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
        }
    });

    confirmPasswordInput.addEventListener('input', () => {
        const value = confirmPasswordInput.value.trim();
        if (value === '') {
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Please confirm your new password.');
            return;
        }

        if (value === newPasswordInput.value) {
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, true);
        } else {
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Passwords do not match');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPasswordValue = newPasswordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        if (newPasswordValue === '' || confirmPasswordValue === '') {
            if (newPasswordValue === '') setFeedback(newPasswordInput, confirmPasswordFeedback, false, 'New password cannot be empty.');
            if (confirmPasswordValue === '') setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Confirm password cannot be empty.');

            alert('Please fill in all password fields.');

            return;
        }

        if (newPasswordValue !== confirmPasswordValue) {
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'Passwords do not match');
            alert('Passwords do not match.');
            return;
        }


        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Reset password failed with status:', response.status, errorText);
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, `Server error: ${response.status}.`);
                return;
            }

            const data = await response.json();

            if (data.success) {
                alert(data.message || 'Password reset successful. Please log in.');
                window.location.href = data.redirect_url;
            } else {
                setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, data.error || 'Could not reset password.');
                alert(data.error || 'Could not reset password.');
            }
        } catch (error) {
            console.error('An error occurred during reset password fetch:', error);
            setFeedback(confirmPasswordInput, confirmPasswordFeedback, false, 'An error occurred. Please try again.');
            alert('An error occurred. Please try again.');
        }
    });
});