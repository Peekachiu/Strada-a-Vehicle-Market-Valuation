export class LoginController {
  constructor(main, router, appState, renderHeader) {
    this.main = main;
    this.router = router;
    this.appState = appState;
    this.renderHeader = renderHeader; // Function to re-render the header
    this.form = this.main.querySelector('#login-form');

    this.handleLogin = this.handleLogin.bind(this);
    this.showMessage = this.showMessage.bind(this); // <-- NEW: Bind the new helper

    if (this.form) {
      this.form.addEventListener('submit', this.handleLogin);
    } else {
      console.error('Login form not found');
    }
  }

  // <-- NEW: This is the new helper function -->
  /**
   * Displays a success or error message in the login form.
   */
  showMessage(message, isError = false) {
    const container = this.main.querySelector('#login-message-container');
    if (!container) return; // Do nothing if the container isn't there
    
    // Set to empty string to clear the message
    if (!message) {
      container.innerHTML = '';
      return;
    }
    
    const messageType = isError ? 'error' : 'success';
    container.innerHTML = `<div class="auth-message ${messageType}">${message}</div>`;
  }


  async handleLogin(event) {
    event.preventDefault();

    // <-- NEW: Clear any previous messages -->
    this.showMessage(''); 

    // 1. Get EMAIL from the form
    const email = this.main.querySelector('#login-email').value;
    const password = this.main.querySelector('#login-password').value;

    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
        },
        // 2. Send the EMAIL as the 'username' (which our backend expects)
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful');

        // <-- NEW: Show success message -->
        this.showMessage('Login successful! Redirecting...', false);

        // 3. Save tokens to localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // 4. Decode token and update appState
        const tokenPayload = this.decodeToken(data.access);
        const realUsername = tokenPayload.username || 'User'; // <-- CHANGED: Added fallback

        // 5. Update the global appState with the REAL username
        this.appState.currentUser = {
          displayName: realUsername, 
        };

        // 6. Re-render the header as a logged-in user
        this.renderHeader(this.appState.currentUser);

        // <-- NEW: Navigate to the homepage *after* a delay -->
        setTimeout(() => {
          this.router.navigate('home');
        }, 1500); // 1.5-second delay
        
      } else {
        console.error('Login failed:', data);
        // <-- CHANGED: Show error message (no alert) -->
        this.showMessage(data.detail || 'Login failed. Please check your credentials.', true);
      }
    } catch (error) {
      console.error('Network error:', error);
      // <-- CHANGED: Show error message (no alert) -->
      this.showMessage('An error occurred. Please try again.', true);
    }
  }

  // Helper function to decode the JWT payload
  decodeToken(token) {
    try {
      // The token is in three parts: header.payload.signature
      // The payload (the middle part) is Base64-encoded JSON
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  // Helper function to get Django's CSRF cookie
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}