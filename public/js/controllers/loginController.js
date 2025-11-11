// We remove the Firebase 'login' import
// import { login } from '../auth.js'; 

export class LoginController {
  constructor(container, router, appState, renderHeader) {
    this.container = container;
    this.router = router;
    this.appState = appState; // <-- ADDED
    this.renderHeader = renderHeader; // <-- ADDED

    this.form = container.querySelector('#login-form');
    this.errorContainer = container.querySelector('#auth-error');
    
    // ** IMPORTANT **
    // This assumes you have fixed the 'login-formmmm' typo in loginView.js
    // If not, this line will still fail
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    } else {
      console.error('Login form #login-form not found. Check view for typos.');
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    this.showError(""); // Clear old errors
    
    const email = this.form.querySelector('#login-email').value;
    const password = this.form.querySelector('#login-password').value;
    
    // --- Dummy Credentials ---
    const DUMMY_EMAIL = 'test@test.com';
    const DUMMY_PASS = 'test';

    if (email === DUMMY_EMAIL && password === DUMMY_PASS) {
      // --- Manually simulate login ---

      // 1. Set the fake user in the global state
      this.appState.currentUser = { 
        displayName: 'Test User', 
        email: DUMMY_EMAIL 
      };
      
      // 2. Manually re-render the header to show the logged-in state
      this.renderHeader(this.appState.currentUser);
      
      // 3. Navigate to the home page
      this.router.navigate('home');

    } else {
      // --- Show error for wrong credentials ---
      console.error("Login failed: Invalid dummy credentials");
      this.showError("Invalid credentials. Use test@test.com and 'test'");
    }
  }
  
  showError(message) {
    if (this.errorContainer) {
      this.errorContainer.textContent = message;
      this.errorContainer.style.display = message ? 'block' : 'none';
    }
  }
}