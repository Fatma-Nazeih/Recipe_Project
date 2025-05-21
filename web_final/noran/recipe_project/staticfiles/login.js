document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');
    const identifierFeedback = document.getElementById('identifier-feedback');
    const passwordFeedback = document.getElementById('password-feedback');

    [identifierFeedback, passwordFeedback].forEach(feedback => {
        const validIcon = feedback.querySelector('.valid-icon');
        const invalidIcon = feedback.querySelector('.invalid-icon');
        const errorMessage = feedback.querySelector('.error-message');
        if (validIcon) validIcon.style.display = 'none';
        if (invalidIcon) invalidIcon.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
    });

    function validateIdentifierFormat() {
        const value = identifierInput.value.trim();
        const validIcon = identifierFeedback.querySelector('.valid-icon');
        const invalidIcon = identifierFeedback.querySelector('.invalid-icon');
        const errorMessage = identifierFeedback.querySelector('.error-message');

        if (validIcon) validIcon.style.display = 'none';
        if (invalidIcon) invalidIcon.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
        identifierInput.classList.remove('success', 'error');
        identifierFeedback.classList.remove('success', 'error');

        if (value === '') return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

        if (emailRegex.test(value) || usernameRegex.test(value)) {
            if (validIcon) validIcon.style.display = 'inline';
            identifierFeedback.classList.add('success');
            identifierInput.classList.add('success');
        } else {
            if (invalidIcon) invalidIcon.style.display = 'inline';
            if (errorMessage) {
                errorMessage.textContent = 'Enter a valid email or username.';
                errorMessage.style.display = 'block';
            }
            identifierFeedback.classList.add('error');
            identifierInput.classList.add('error');
        }
    }

    identifierInput.addEventListener('input', validateIdentifierFormat);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const generalErrorMessage = loginForm.querySelector('.login-header .error-message');
        const passwordErrorMessage = passwordFeedback.querySelector('.error-message');
        const identifierErrorMessage = identifierFeedback.querySelector('.error-message');

        if (generalErrorMessage) generalErrorMessage.style.display = 'none';
        if (passwordErrorMessage) passwordErrorMessage.style.display = 'none';
        if (identifierErrorMessage) identifierErrorMessage.style.display = 'none';

        passwordFeedback.classList.remove('error', 'success');
        identifierFeedback.classList.remove('error', 'success');
        passwordInput.classList.remove('error', 'success');
        identifierInput.classList.remove('error', 'success');
        if (passwordFeedback.querySelector('.valid-icon')) passwordFeedback.querySelector('.valid-icon').style.display = 'none';
        if (passwordFeedback.querySelector('.invalid-icon')) passwordFeedback.querySelector('.invalid-icon').style.display = 'none';
        if (identifierFeedback.querySelector('.valid-icon')) identifierFeedback.querySelector('.valid-icon').style.display = 'none';
        if (identifierFeedback.querySelector('.invalid-icon')) identifierFeedback.querySelector('.invalid-icon').style.display = 'none';

        const formData = new FormData(loginForm);

        try {
            const response = await fetch('/login/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Login failed with status:', response.status, errorText);
                const displayError = passwordFeedback.querySelector('.error-message');
                displayError.textContent = `Server error: ${response.status}`;
                displayError.style.display = 'block';
                passwordFeedback.classList.add('error');
                passwordInput.classList.add('error');
                return;
            }

            const data = await response.json();

            if (data.success) {
                window.location.href = data.redirect_url;
            } else {
                const errorMessage = passwordFeedback.querySelector('.error-message');
                errorMessage.textContent = data.error || 'Login failed. Please check your credentials.';
                errorMessage.style.display = 'block';
                passwordFeedback.classList.add('error');
                passwordInput.classList.add('error');

                passwordInput.value = '';
            }
        } catch (error) {
            console.error('An error occurred during login fetch:', error);
            const errorMessage = passwordFeedback.querySelector('.error-message');
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
            passwordFeedback.classList.add('error');
            passwordInput.classList.add('error');
        }
    });
});