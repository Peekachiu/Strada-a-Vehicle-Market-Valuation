export class LoginController {
  constructor(main, router, appState, renderHeader) {
    this.main = main;
    this.router = router;
    this.appState = appState;
    this.renderHeader = renderHeader; // Function to re-render the header
    this.form = this.main.querySelector('#login-form');

    this.handleLogin = this.handleLogin.bind(this);

    if (this.form) {
      this.form.addEventListener('submit', this.handleLogin);
    } else {
      console.error('Login form not found');
    }
  }

  async handleLogin(event) {
    event.preventDefault();

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

        // 3. Save tokens to localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // 4. --- THIS IS THE FIX ---
        // Decode the token to get the user's REAL username
        const tokenPayload = this.decodeToken(data.access);
        const realUsername = tokenPayload.username; // This will be "Zanne"

        // 5. Update the global appState with the REAL username
        this.appState.currentUser = {
          displayName: realUsername, 
        };

        // 6. Re-render the header as a logged-in user
        this.renderHeader(this.appState.currentUser);

        // 7. Navigate to the homepage
        this.router.navigate('home');
        
      } else {
        console.error('Login failed:', data);
        alert(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred. Please try again.');
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