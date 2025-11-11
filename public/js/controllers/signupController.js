// import { signUp } from '../auth.js'; // <-- REMOVED

export class SignUpController {
  constructor(container, router, appState, renderHeader) {
    this.container = container;
    this.router = router;
    this.appState = appState; // <-- ADDED
    this.renderHeader = renderHeader; // <-- ADDED
    
    this.form = container.querySelector('#signup-form');
    this.errorContainer = container.querySelector('#auth-error');
    
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    } else {
      console.error('Signup form #signup-form not found. Check view for typos.');
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    this.showError(""); // Clear old errors
    
    const name = this.form.querySelector('#signup-name').value;
    const email = this.form.querySelector('#signup-email').value;
    const password = this.form.querySelector('#signup-password').value;
    const confirmPassword = this.form.querySelector('#signup-confirm-password').value;

    if (password !== confirmPassword) {
      this.showError("Passwords do not match.");
      return;
    }
    
    // --- Dummy Signup Logic ---
    try {
      if (!name || !email || !password) {
        throw new Error("Please fill out all fields.");
      }
      
      // In dummy mode, signup is just like login.
      console.log("Dummy signup successful:", name, email);

      // 1. Set the fake user in the global state
      this.appState.currentUser = { 
        displayName: name, 
        email: email 
      };
      
      // 2. Manually re-render the header to show the logged-in state
      this.renderHeader(this.appState.currentUser);
      
      // 3. Navigate to the home page
      this.router.navigate('home');
      
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