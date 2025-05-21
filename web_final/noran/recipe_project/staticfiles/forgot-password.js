document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    if(!form) return;

    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('email-feedback');

    if(!emailInput || !emailFeedback) {
        console.error("Missing required elements for forgot password form.");
        return;
    }

    const validIcon = emailFeedback.querySelector('.valid-icon');
    const invalidIcon = emailFeedback.querySelector('.invalid-icon');
    const errorMessage = emailFeedback.querySelector('.error-message');

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

    function validateEmailFormat() {
        const value = emailInput.value.trim();
        if (value === '') {
            setFeedback(emailInput, emailFeedback, false, 'Email cannot be empty.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            setFeedback(emailInput, emailFeedback, true);
            return true;
        } else {
            setFeedback(emailInput, emailFeedback, false, 'Invalid email format');
            return false;
        }
    }

    emailInput.addEventListener('input', validateEmailFormat);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateEmailFormat()) {
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
                console.error('Forgot password submission failed with status:', response.status, errorText);
                setFeedback(emailInput, emailFeedback, false, `Server error: ${response.status}.`);
                return;
            }

            const data = await response.json();

            if (data.success) {
                window.location.href = data.redirect_url;
            } else {
                setFeedback(emailInput, emailFeedback, false, data.error || 'Could not initiate password reset.');
            }
        } catch (error) {
            console.error('An error occurred during forgot password fetch:', error);
            setFeedback(emailInput, emailFeedback, false, 'An error occurred. Please try again.');
        }
    });
});