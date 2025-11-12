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
    
    // (We don't use appState or renderHeader here, but we accept them)

    // Find the form *inside* the <main> element
    this.form = this.main.querySelector('#signup-form'); 

    // Bind 'this' to our handler so it works in the event listener
    this.handleSignUp = this.handleSignUp.bind(this);

    // Attach the event listener
    if (this.form) {
      this.form.addEventListener('submit', this.handleSignUp);
    } else {
      console.error('Signup form not found. Check your view or form ID.');
    }
  }

  /**
   * Handles the signup form submission.
   */
  async handleSignUp(event) {
    event.preventDefault(); 

    // 1. Get ALL data from the form
    const fullName = this.main.querySelector('#signup-name').value;
    const email = this.main.querySelector('#signup-email').value;
    const password = this.main.querySelector('#signup-password').value;
    const phone = this.main.querySelector('#signup-phone').value; 

    console.log('Sending to backend:', { fullName, email, password, phone });

    try {
      // 2. Send the fetch request
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
        },
        // --- THIS IS THE CHANGE ---
        // We now send 'email' as the username
        // and send 'full_name' as a new field.
        body: JSON.stringify({ 
          email: email, 
          password: password,
          phone_number_write: phone,
          full_name: fullName // Send the full name
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
}