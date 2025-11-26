export function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-container-grid">
      <div class="auth-grid">
        <!-- Left Side - Branding -->
        <div class="auth-branding animate-fade-up">
          <div class="auth-brand-logo">
            <svg class="auth-car-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.4 16.1c-.5 1.1.3 2.4 1.6 2.4H4c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h2c1.1 0 2.1-.8 2.1-1.9 0-.8-.5-1.5-1.2-1.8zM2 12v-1c0-.6.4-1 1-1h4v1H2zm14 0v-1c0-.6.4-1 1-1h4v1h-5zM6 6h4c.6 0 1 .4 1 1v3H6V6zM14 6h4c.6 0 1 .4 1 1v3h-5V6z"></path><circle cx="6.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
            <span class="auth-brand-name">Strada</span>
          </div>
          <h2 class="auth-branding-title">Welcome Back!</h2>
          <p class="auth-branding-sub">
            Access your vehicle valuations and continue your journey with Strada.
          </p>
          <ul class="auth-features-list">
            <li class="auth-feature-item">
              <span class="auth-check-icon">✓</span>
              <p>Track your valuation history</p>
            </li>
            <li class="auth-feature-item">
              <span class="auth-check-icon">✓</span>
              <p>Save favorite vehicles</p>
            </li>
            <li class="auth-feature-item">
              <span class="auth-check-icon">✓</span>
              <p>Get personalized insights</p>
            </li>
          </ul>
        </div>
        
        <!-- Right Side - Login Form -->
        <div class="auth-card animate-fade-up stagger-2">
          <h2 class="auth-title">Login to Your Account</h2>
          <p class="auth-sub">Enter your credentials to access your account</p>

          <!-- Add error container -->
          <div id="auth-error" class="auth-error"></div>

          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email" class="form-label">Email Address</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <input id="login-email" name="email" type="email" class="form-input with-icon" required placeholder="you@example.com" />
              </div>
            </div>

            <div class="form-group">
              <div class="form-row-space-between">
                <label for="login-password" class="form-label">Password</label>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input id="login-password" name="password" type="password" class="form-input with-icon" required placeholder="••••••••" />
                <span class="password-toggle-icon" id="password-toggle" title="Show Password">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </span>
              </div>
            </div>
            
            <div class="checkbox-group">
              <input type="checkbox" id="remember" name="remember" class="form-checkbox">
              <label for="remember" class="form-label-checkbox">Remember me for 30 days</label>
            </div>

            <div id="login-message-container" class="auth-message-container"></div>

            <button class="btn btn-primary btn-full" type="submit">
              Sign In
              <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            
            <hr class="auth-separator" />

            <p class="auth-footer">
              Don't have an account? <a href="#signup" class="nav-item-link" data-navigate="signup">Sign up for free</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;
}