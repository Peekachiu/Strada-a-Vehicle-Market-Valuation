export function renderSignUp(container) {
  container.innerHTML = `
    <div class="auth-container-grid">
      <div class="auth-grid">
        <!-- Left Side - Branding -->
        <div class="auth-branding animate-fade-up">
          <div class="auth-brand-logo">
            <img src="/images/strada_logo.jpg" alt="Strada" class="auth-brand-img" style="height: 80px; width: auto; border-radius: 12px;">
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
        <div class="auth-card animate-fade-up stagger-2">
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
                <input id="signup-name" name="fullName" type="text" class="form-input with-icon" required placeholder="Edwin Neoh" />
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
              <label for="signup-phone" class="form-label">Phone Number</label>
              <div class="input-with-icon">
                <span class="input-icon" style="width: auto; padding-right: 5px; font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">
                  +60
                </span>
                <input id="signup-phone" name="phone" type="tel" class="form-input with-icon" style="padding-left: 45px;" placeholder="123456789" />
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
                I agree to the <a href="#" id="link-terms" class="nav-item-link">Terms of Service</a>
                and <a href="#" id="link-privacy" class="nav-item-link">Privacy Policy</a>
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