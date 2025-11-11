import { signUp } from '../auth.js';

export class SignUpController {
  constructor(container, router) {
    this.container = container;
    this.router = router;
    this.form = container.querySelector('#signup-form');
    this.errorContainer = container.querySelector('#auth-error');
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    this.showError(""); // Clear old errors
    
    const fullName = this.form.querySelector('#signup-name').value;
    const email = this.form.querySelector('#signup-email').value;
    const password = this.form.querySelector('#signup-password').value;
    const confirmPassword = this.form.querySelector('#signup-confirm-password').value;
    const terms = this.form.querySelector('#signup-terms').checked;
    
    if (password !== confirmPassword) {
      this.showError("Passwords do not match.");
      return;
    }
    
    if (!terms) {
      this.showError("You must accept the terms and conditions.");
      return;
    }
    
    try {
      await signUp(email, password, fullName);
      // The onAuthStateChanged listener in app.js will handle navigation
    } catch (error) {
      console.error("Sign up failed:", error.message);
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