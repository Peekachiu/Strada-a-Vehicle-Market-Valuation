export class SignUpController {
  /**
   * Initializes the controller.
   * @param {HTMLElement} main The <main> element to render content into.
   * @param {object} router The main application router.
   * @param {object} appState The global application state.
   * @param {function} renderHeader The function to re-render the header.
   */
  constructor(main, router, appState, renderHeader) {
    this.main = main;    // The <main> element
    this.router = router;  // The app.js router

    // Find the form *inside* the <main> element
    this.form = this.main.querySelector('#signup-form');
    this.passwordInput = this.main.querySelector('#signup-password');
    this.confirmPasswordInput = this.main.querySelector('#signup-confirm-password');

    // Bind 'this' to our handler so it works in the event listener
    this.handleSignUp = this.handleSignUp.bind(this);
    this.validatePasswords = this.validatePasswords.bind(this);

    // Attach the event listener
    if (this.form) {
      this.form.addEventListener('submit', this.handleSignUp);
    } else {
      console.error('Signup form not found.');
    }

    // Add real-time validation as the user types
    if (this.passwordInput && this.confirmPasswordInput) {
      this.passwordInput.addEventListener('keyup', this.validatePasswords);
      this.confirmPasswordInput.addEventListener('keyup', this.validatePasswords);
    }
  }

  /**
   * Handles the signup form submission.
   */
  async handleSignUp(event) {
    event.preventDefault(); // Stop the form from submitting

    // --- 1. GET ALL DATA FROM THE FORM ---
    const fullName = this.main.querySelector('#signup-name').value;
    const email = this.main.querySelector('#signup-email').value;
    const phone = this.main.querySelector('#signup-phone').value;
    const password = this.main.querySelector('#signup-password').value;
    // Get the terms checkbox
    const termsCheckbox = this.main.querySelector('#signup-terms');

    // --- 2. CHECK FOR TERMS & CONDITIONS ---
    if (!termsCheckbox.checked) {
      console.log('Validation Error: Terms of Service must be accepted.');
      alert('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    // --- 3. CHECK FOR EMPTY FIELDS ---
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    // --- 4. PHONE VALIDATION ---
    // Must be integer only or start with + and integer
    // Regex: Optional + at start, then digits
    if (!/^(\+)?\d+$/.test(phone)) {
      alert('Phone number must contain only digits (and optional leading +).');
      return;
    }

    // Check reasonable length (9 to 15 to cover various inputs including country code)
    if (phone.length < 9 || phone.length > 15) {
      alert('Phone number length is invalid.');
      return;
    }

    // --- 5. PASSWORD VALIDATION ---
    // Length >= 8
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    // Uppercase
    if (!/[A-Z]/.test(password)) {
      alert('Password must contain at least one uppercase letter.');
      return;
    }
    // Special Symbol
    if (!/[^A-Za-z0-9]/.test(password)) {
      alert('Password must contain at least one special character.');
      return;
    }

    // --- 6. PASSWORD CONFIRMATION CHECK ---
    const passwordsMatch = this.validatePasswords();
    if (!passwordsMatch) {
      alert('Passwords do not match. Please check and try again.');
      return;
    }

    // --- 7. SEND TO BACKEND ---
    // Logic: If user typed +60 or 60 at the start, don't add prefix.
    let phoneToSend = phone;
    // Remove all spaces just in case
    phoneToSend = phoneToSend.replace(/\s/g, '');

    if (!phoneToSend.startsWith('+')) {
      // If it starts with 60, just add + ? Or assume it is full?
      // If user typed '601234...', likely meant +60.
      if (phoneToSend.startsWith('60') && phoneToSend.length > 9) {
        phoneToSend = '+' + phoneToSend;
      } else {
        // Append static prefix
        phoneToSend = '+60' + phoneToSend;
      }
    }
    // If it already starts with +, we trust it.

    console.log('Sending to backend:', { fullName, email, password, phone: phoneToSend });

    try {
      // Send the fetch request
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
        },
        body: JSON.stringify({
          email: email,
          password: password,
          phone_number_write: phoneToSend,
          full_name: fullName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign up successful:', data);
        alert('Sign up successful! Please log in.');
        this.router.navigate('login');
      } else {
        console.error('Sign up failed:', data);
        let errorMessage = 'Sign up failed.\n';

        // Handle all possible backend errors
        if (data.email) errorMessage += `Email: ${data.email[0]}\n`;
        if (data.full_name) errorMessage += `Name: ${data.full_name[0]}\n`;
        if (data.password) errorMessage += `Password: ${data.password[0]}\n`;
        if (data.phone_number_write) errorMessage += `Phone: ${data.phone_number_write[0]}\n`;
        if (data.non_field_errors) errorMessage += `${data.non_field_errors[0]}\n`;

        // Fallback
        if (errorMessage === 'Sign up failed.\n') {
          errorMessage += 'Please check your input and try again.';
        }

        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('A network error occurred. Please try again.');
    }
  }

  /**
   * Helper function to get Django's CSRF cookie.
   */
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  validatePasswords() {
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    // Check if they have typed enough to validate
    if (password.length === 0 && confirmPassword.length === 0) {
      return true; // Don't show an error for an empty form
    }

    if (password !== confirmPassword) {
      // REQUIREMENT MET: Log the validation error to the console
      console.log('Validation Error: Passwords do not match.');
      // TODO: Later, we will show this error on the UI
      return false; // Passwords don't match
    }

    return true; // Passwords match
  }
}