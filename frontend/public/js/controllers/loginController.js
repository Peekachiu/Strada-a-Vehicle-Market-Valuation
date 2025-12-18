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

    // --- Forgot Password Logic ---
    this.forgotLink = this.main.querySelector('#forgot-password-link');
    this.modal = document.getElementById('forgot-password-modal'); // It might be in body now or later

    // If modal is in the view but not body, move it (fix for stacking context)
    if (!this.modal) {
      this.modal = this.main.querySelector('#forgot-password-modal');
      if (this.modal) document.body.appendChild(this.modal);
    }

    if (this.forgotLink && this.modal) {
      this.initForgotModal();
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

  initForgotModal() {
    this.closeModalBtn = this.modal.querySelector('#close-modal-btn');
    this.step1Form = this.modal.querySelector('#step-1-form');
    this.step2Form = this.modal.querySelector('#step-2-form');
    this.humanBox = this.modal.querySelector('#human-verification-box');
    this.humanSpinner = this.modal.querySelector('#human-check-spinner');
    this.humanCheckMark = this.modal.querySelector('#human-check-mark');
    this.humanVerifiedInput = this.modal.querySelector('#human-verified');
    this.backToStep1Btn = this.modal.querySelector('#back-to-step-1');

    // Open
    this.forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal();
    });

    // Close
    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Human Verification Click
    this.humanBox.addEventListener('click', () => this.handleHumanCheck());

    // Steps
    this.step1Form.addEventListener('submit', (e) => this.handleStep1Submit(e));
    this.step2Form.addEventListener('submit', (e) => this.handleStep2Submit(e));
    this.backToStep1Btn.addEventListener('click', () => this.switchStep(1));

    // Cleanup
    this.cleanup = () => {
      if (this.modal && this.modal.parentNode) {
        this.modal.parentNode.removeChild(this.modal);
      }
      window.removeEventListener('hashchange', this.cleanup);
    };
    window.addEventListener('hashchange', this.cleanup);
  }

  openModal() {
    this.modal.classList.remove('hidden');
    this.switchStep(1);
    this.resetHumanCheck();
  }

  closeModal() {
    this.modal.classList.add('hidden');
  }

  switchStep(step) {
    const title = this.modal.querySelector('#modal-title-text');
    const sub = this.modal.querySelector('#modal-subtitle-text');
    const msg1 = this.modal.querySelector('#step-1-message');
    const msg2 = this.modal.querySelector('#step-2-message');

    if (msg1) msg1.innerHTML = '';
    if (msg2) msg2.innerHTML = '';

    if (step === 1) {
      this.step1Form.classList.remove('hidden');
      this.step2Form.classList.add('hidden');
      title.textContent = "Reset Password";
      sub.textContent = "Enter your email to receive a verification code.";
    } else {
      this.step1Form.classList.add('hidden');
      this.step2Form.classList.remove('hidden');
      title.textContent = "Verify & Set Password";
      sub.textContent = "Enter the 6-digit code sent to your email.";
    }
  }

  resetHumanCheck() {
    this.humanVerifiedInput.value = 'false';
    this.humanSpinner.style.borderColor = '#d1d5db';
    this.humanCheckMark.style.display = 'none';
    this.humanBox.style.pointerEvents = 'auto';
  }

  handleHumanCheck() {
    if (this.humanVerifiedInput.value === 'true') return;

    // Simulate "thinking"
    this.humanSpinner.style.borderTopColor = '#3b82f6';
    this.humanSpinner.style.borderRightColor = '#3b82f6';
    this.humanSpinner.style.animation = 'spin 1s linear infinite';

    // Add temporary style for spin if not in CSS
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      this.humanSpinner.style.animation = 'none';
      this.humanSpinner.style.borderColor = '#10b981'; // Green
      this.humanCheckMark.style.display = 'block';
      this.humanVerifiedInput.value = 'true';
      this.humanBox.style.pointerEvents = 'none'; // Prevent re-click
    }, 1200);
  }

  async handleStep1Submit(e) {
    e.preventDefault();
    const email = this.modal.querySelector('#reset-email').value;
    const isHuman = this.humanVerifiedInput.value === 'true';
    const msgContainer = this.modal.querySelector('#step-1-message');

    if (!isHuman) {
      msgContainer.innerHTML = `<div class="auth-message error">Please verify that you are human.</div>`;
      return;
    }

    // Loading State
    const btn = this.step1Form.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch('/api/password-reset/request-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken')
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        // Success -> Go to Step 2
        this.switchStep(2);
      } else {
        msgContainer.innerHTML = `<div class="auth-message error">${data.error || 'Failed to send code.'}</div>`;
      }
    } catch (error) {
      console.error(error);
      msgContainer.innerHTML = `<div class="auth-message error">Network error. Please try again.</div>`;
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  }

  async handleStep2Submit(e) {
    e.preventDefault();
    const email = this.modal.querySelector('#reset-email').value;
    const otp = this.modal.querySelector('#otp-code').value;
    const newPass = this.modal.querySelector('#new-password').value;
    const confirmPass = this.modal.querySelector('#confirm-password').value;
    const msgContainer = this.modal.querySelector('#step-2-message');

    if (newPass !== confirmPass) {
      msgContainer.innerHTML = `<div class="auth-message error">Passwords do not match.</div>`;
      return;
    }

    if (newPass.length < 8) {
      msgContainer.innerHTML = `<div class="auth-message error">Password must be at least 8 characters.</div>`;
      return;
    }

    // Loading State
    const btn = this.step2Form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Resetting...';
    btn.disabled = true;

    try {
      const response = await fetch('/api/password-reset/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken')
        },
        body: JSON.stringify({ email, otp, new_password: newPass })
      });

      const data = await response.json();

      if (response.ok) {
        msgContainer.innerHTML = `<div class="auth-message success">Password reset successful! You can now log in.</div>`;
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      } else {
        msgContainer.innerHTML = `<div class="auth-message error">${data.error || 'Reset failed.'}</div>`;
      }
    } catch (error) {
      console.error(error);
      msgContainer.innerHTML = `<div class="auth-message error">Network error. Please try again.</div>`;
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  }
}