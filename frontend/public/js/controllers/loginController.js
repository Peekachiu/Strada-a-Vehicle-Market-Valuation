export class LoginController {
  constructor(main, router, appState, renderHeader) {
    this.main = main;
    this.router = router;
    this.appState = appState;
    this.renderHeader = renderHeader; // Function to re-render the header
    this.form = this.main.querySelector('#login-form');

    this.handleLogin = this.handleLogin.bind(this);
    this.showMessage = this.showMessage.bind(this);

    if (this.form) {
      this.form.addEventListener('submit', this.handleLogin);

      // Password toggle logic
      const passwordToggle = this.main.querySelector('#password-toggle');
      const passwordInput = this.main.querySelector('#login-password');

      if (passwordToggle && passwordInput) {
        const showPassword = () => passwordInput.type = 'text';
        const hidePassword = () => passwordInput.type = 'password';

        passwordToggle.addEventListener('mousedown', showPassword);
        passwordToggle.addEventListener('mouseup', hidePassword);
        passwordToggle.addEventListener('mouseleave', hidePassword);
        passwordToggle.addEventListener('touchstart', (e) => {
          e.preventDefault();
          showPassword();
        });
        passwordToggle.addEventListener('touchend', hidePassword);
      }
    } else {
      console.error('Login form not found');
    }
  }

  showMessage(message, isError = false) {
    const container = this.main.querySelector('#login-message-container');
    if (!container) return;

    if (!message) {
      container.innerHTML = '';
      return;
    }

    const messageType = isError ? 'error' : 'success';
    container.innerHTML = `<div class="auth-message ${messageType}">${message}</div>`;
  }

  async handleLogin(event) {
    event.preventDefault();

    this.showMessage('');

    const email = this.main.querySelector('#login-email').value;
    const password = this.main.querySelector('#login-password').value;

    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful');
        this.showMessage('Login successful! Redirecting...', false);

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        const tokenPayload = this.decodeToken(data.access);
        const realUsername = tokenPayload.username || 'User';

        this.appState.currentUser = {
          displayName: realUsername,
        };

        this.renderHeader(this.appState.currentUser);

        setTimeout(() => {
          this.router.navigate('home');
        }, 1500);

      } else {
        console.error('Login failed:', data);
        this.showMessage(data.detail || 'Login failed. Please check your credentials.', true);
      }
    } catch (error) {
      console.error('Network error:', error);
      this.showMessage('An error occurred. Please try again.', true);
    }
  }

  decodeToken(token) {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

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