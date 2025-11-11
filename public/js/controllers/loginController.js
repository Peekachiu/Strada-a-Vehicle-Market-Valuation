import { login } from '../auth.js';

export class LoginController {
  constructor(container, router) {
    this.container = container;
    this.router = router;
    this.form = container.querySelector('#login-form');
    this.errorContainer = container.querySelector('#auth-error');
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    this.showError(""); // Clear old errors
    
    const email = this.form.querySelector('#login-email').value;
    const password = this.form.querySelector('#login-password').value;
    
    try {
      await login(email, password);
      // The onAuthStateChanged listener in app.js will handle navigation
    } catch (error) {
      console.error("Login failed:", error.message);
      this.showError(error.message);
    }
  }
  
  showError(message) {
    if (this.errorContainer) {
      this.errorContainer.textContent = message;
      this.errorContainer.style.display = message ? 'block' : 'none';
    }
  }
}