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

    const username = this.main.querySelector('#login-username').value;
    const password = this.main.querySelector('#login-password').value;

    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful');

        // 1. Save tokens to localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // 2. Update the global appState
        // We'll create a simple user object for now
        this.appState.currentUser = {
          displayName: username,
          // We'll get more details later from a /api/user/me/ endpoint
        };

        // 3. Re-render the header as a logged-in user
        this.renderHeader(this.appState.currentUser);

        // 4. Navigate to the homepage
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

  // Helper function (also needed for this controller)
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