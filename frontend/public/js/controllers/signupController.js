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

    // --- 2. NEW: CHECK FOR TERMS & CONDITIONS ---
    if (!termsCheckbox.checked) {
      // REQUIREMENT MET: Log validation error to the console
      console.log('Validation Error: Terms of Service must be accepted.');
      
      // TODO: Later, you can show this on the UI
      alert('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return; // Stop the form submission
    }

    // --- 3. CHECK FOR EMPTY FIELDS ---
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      if (!fullName.trim()) {
        console.log('Validation Error: Full Name cannot be empty.');
      }
      if (!email.trim()) {
        console.log('Validation Error: Email cannot be empty.');
      }
      if (!phone.trim()) {
        console.log('Validation Error: Phone Number cannot be empty.');
      }
      if (!password.trim()) {
        console.log('Validation Error: Password cannot be empty.');
      }
      alert('Please fill out all required fields.');
      return; // Stop the form submission
    }

    // --- 4. PASSWORD CONFIRMATION CHECK ---
    const passwordsMatch = this.validatePasswords();
    if (!passwordsMatch) {
      // The error is already logged to the console by validatePasswords()
      alert('Passwords do not match. Please check and try again.');
      return; // Stop the form submission
    }

    // --- 5. SEND TO BACKEND (if all checks pass) ---
    console.log('Sending to backend:', { fullName, email, password, phone });

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
          phone_number_write: phone,
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
        let errorMessage = 'Sign up failed. ';
        if (data.username) errorMessage += `Username: ${data.username[0]} `;
        if (data.email) errorMessage += `Email: ${data.email[0]} `;
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