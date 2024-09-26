// Utility functions
const $ = id => document.getElementById(id);
const showError = (id, message) => $(id).textContent = message;
const clearError = id => $(id).textContent = '';
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validation functions
const validateField = (value, errorId, errorMessage) => {
    value ? clearError(errorId) : showError(errorId, errorMessage);
    return !!value;
};

const validateEmail = (email, errorId) => {
    switch (true) {
        case !email:
            showError(errorId, 'Email is required');
            return false;
        case !isValidEmail(email):
            showError(errorId, 'Invalid email format');
            return false;
        default:
            clearError(errorId);
            return true;
    }
};

const checkPasswordStrength = (password) => {
    const weakRegex = /^.{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (strongRegex.test(password)) {
        return 'strong';
    } else if (mediumRegex.test(password)) {
        return 'medium';
    } else if (weakRegex.test(password)) {
        return 'weak';
    } else {
        return 'very-weak';
    }
};

const validatePassword = (password, errorId, strengthId) => {
    const strength = checkPasswordStrength(password);
    const strengthElement = $(strengthId);

    if (strengthElement) {
        strengthElement.className = 'password-strength';
        strengthElement.classList.add(strength);
    }

    switch (strength) {
        case 'very-weak':
            showError(errorId, 'Password must be at least 8 characters long');
            return false;
        case 'weak':
            showError(errorId, 'Password should include uppercase letters, lowercase letters, and numbers');
            return false;
        case 'medium':
            showError(errorId, 'Password could be stronger. Try adding a special character');
            return true;
        case 'strong':
            clearError(errorId);
            return true;
    }
};

const validateAge = age => {
    const numAge = Number(age);
    return !isNaN(numAge) && numAge >= 18 && numAge <= 100;
};

// Form validation
const validateForm = (formId, validations) => {
    const form = $(formId);
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const isValid = validations.every(validation => validation());
            isValid && alert(`${formId === 'registrationForm' ? 'Registration' : 'Login'} successful!`);
        });
    }
};

// Registration form validations
const registrationValidations = [
    () => {
        const name = $('name');
        if (name) {
            const isValid = /^[A-Za-z ]+$/.test(name.value.trim());
            isValid ? clearError('nameError') : showError('nameError', 'Name should only contain letters and spaces');
            return isValid;
        }
        return true;
    },
    () => $('email') && validateEmail($('email').value.trim(), 'emailError'),
    () => $('password') && validatePassword($('password').value, 'passwordError', 'passwordStrength'),
    () => {
        if ($('password') && $('confirmPassword')) {
            const isMatch = $('password').value === $('confirmPassword').value;
            isMatch ? clearError('confirmPasswordError') : showError('confirmPasswordError', 'Passwords do not match');
            return isMatch;
        }
        return true;
    },
    () => {
        if ($('age')) {
            const age = $('age').value;
            const isValidAge = validateAge(age);
            isValidAge ? clearError('ageError') : showError('ageError', 'Age must be a number between 18 and 100');
            return isValidAge;
        }
        return true;
    },
    () => $('genderError') && validateField(document.querySelector('input[name="gender"]:checked'), 'genderError', 'Please select a gender'),
    () => $('country') && validateField($('country').value, 'countryError', 'Please select a country'),
    () => $('terms') && validateField($('terms').checked, 'termsError', 'You must agree to the Terms and Conditions')
];

// Login form validations
const loginValidations = [
    () => $('loginEmail') && validateEmail($('loginEmail').value.trim(), 'loginEmailError'),
    () => $('loginPassword') && validateField($('loginPassword').value, 'loginPasswordError', 'Password is required')
];

// Initialize form validations
validateForm('registrationForm', registrationValidations);
validateForm('loginForm', loginValidations);

// Add real-time password strength checking
const passwordInput = $('password');
if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        validatePassword(passwordInput.value, 'passwordError', 'passwordStrength');
    });
}