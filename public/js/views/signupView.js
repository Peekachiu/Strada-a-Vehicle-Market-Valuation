export function renderSignUp(container) {
  container.innerHTML = `
    <div class="auth-container-grid">
      <div class="auth-grid">
        <!-- Left Side - Branding -->
        <div class="auth-branding">
          <div class="auth-brand-logo">
            <svg class="auth-car-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8zM2 12v-1c0-.6.4-1 1-1h4v1H2zm14 0v-1c0-.6.4-1 1-1h4v1h-5zM6 6h4c.6 0 1 .4 1 1v3H6V6zM14 6h4c.6 0 1 .4 1 1v3h-5V6z"></path><circle cx="6.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
            <span class="auth-brand-name">Strada</span>
          </div>
          <h2 class="auth-branding-title">Start Your Journey</h2>
          <p class="auth-branding-sub">
            Join thousands of users who trust Strada for accurate vehicle valuations.
          </p>
          <ul class="auth-features-list">
            <li class="auth-feature-item">
              <span class="auth-check-icon">✓</span>
              <p>Free unlimited valuations</p>
            </li>
            <li class="auth-feature-item">
              <span class="auth-check-icon">✓</span>
              <p>Access to market trends</p>
            </li>
            <li class="auth-feature-item">
              <span class="auth-check-icon">✓</span>
              <p>Detailed analytics & insights</p>
            </li>
          </ul>
        </div>
        
        <!-- Right Side - Sign Up Form -->
        <div class="auth-card">
          <h2 class="auth-title">Create an Account</h2>
          <p class="auth-sub">Sign up to start getting vehicle valuations</p>

          <!-- Add error container -->
          <div id="auth-error" class="auth-error"></div>

          <form id="signup-form" class="auth-form">
            
            <div class="form-group">
              <label for="signup-name" class="form-label">Full Name</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input id="signup-name" name="fullName" type="text" class="form-input with-icon" required placeholder="John Doe" />
              </div>
            </div>

            <div class="form-group">
              <label for="signup-email" class="form-label">Email Address</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input id="signup-email" name="email" type="email" class="form-input with-icon" required placeholder="you@example.com" />
              </div>
            </div>

            <div class="form-group">
              <label for="signup-phone" class="form-label">Phone Number (Optional)</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                <input id="signup-phone" name="phone" type="tel" class="form-input with-icon" placeholder="+1 (555) 123-4567" />
              </div>
            </div>

            <div class="form-group">
              <label for="signup-password" class="form-label">Password</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input id="signup-password" name="password" type="password" class="form-input with-icon" required placeholder="••••••••" />
              </div>
            </div>

            <div class="form-group">
              <label for="signup-confirm-password" class="form-label">Confirm Password</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input id="signup-confirm-password" name="confirmPassword" type="password" class="form-input with-icon" required placeholder="••••••••" />
              </div>
            </div>
            
            <div class="checkbox-group">
              <input type="checkbox" id="signup-terms" name="terms" class="form-checkbox">
              <label for="signup-terms" class="form-label-checkbox">
                I agree to the <a href="#" class="nav-item-link">Terms of Service</a>
                and <a href="#" class="nav-item-link">Privacy Policy</a>
              </label>
            </div>

            <button class="btn btn-primary btn-full" type="submit">
              Create Account
              <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            
            <hr class="auth-separator" />

            <p class="auth-footer">
              Already have an account? <a href="#login" class="nav-item-link" data-navigate="login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;
}