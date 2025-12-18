export function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-container-grid">
      <div class="auth-grid">
        <!-- Left Side - Branding -->
        <div class="auth-branding animate-fade-up">
          <div class="auth-brand-logo">
            <img src="/images/strada_logo.jpg" alt="Strada" class="auth-brand-img" style="height: 80px; width: auto; border-radius: 12px;">
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
                <a href="#" class="forgot-link" id="forgot-password-link">Forgot password?</a>
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

    <!-- OTP Forgot Password Modal -->
    <div id="forgot-password-modal" class="modal-overlay hidden" style="z-index: 99999;">
        <div class="modal-content animate-fade-up" style="max-width: 480px; width: 95%;">
            <div class="modal-header">
                <h3 class="modal-title" id="modal-title-text">Reset Password</h3>
                <p class="modal-subtitle" id="modal-subtitle-text">Enter your email to receive a verification code.</p>
                <button class="close-btn" id="close-modal-btn">×</button>
            </div>
            
            <div class="modal-body">
                <!-- STEP 1: Email + Human Verification -->
                <form id="step-1-form">
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label for="reset-email" class="form-label">Email Address</label>
                        <div class="input-with-icon">
                             <span class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                             </span>
                            <input type="email" id="reset-email" class="form-input with-icon" placeholder="Enter your email" required>
                        </div>
                    </div>

                    <!-- MOCK Human Verification -->
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <div id="human-verification-box" style="
                            border: 1px solid #e5e7eb; 
                            background: #f9fafb; 
                            padding: 1rem; 
                            border-radius: 8px; 
                            display: flex; 
                            align-items: center; 
                            gap: 1rem;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">
                            <div id="human-check-spinner" style="
                                width: 24px; 
                                height: 24px; 
                                border: 2px solid #d1d5db; 
                                border-radius: 4px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: white;
                            ">
                                <span id="human-check-mark" style="display: none; color: #10b981; font-weight: bold;">✓</span>
                            </div>
                            <span style="font-size: 0.9rem; color: #374151; font-weight: 500;">I am human</span>
                            <img src="/images/recaptcha-logo.png" style="height: 24px; margin-left: auto; opacity: 0.5;" alt=""> <!-- Fallback if no image, it's just a space -->
                        </div>
                        <input type="hidden" id="human-verified" value="false">
                    </div>

                    <div id="step-1-message" class="auth-message-container"></div>

                    <button type="submit" class="btn btn-primary btn-full" id="btn-send-code">
                        Send Verification Code
                    </button>
                </form>

                <!-- STEP 2: OTP + New Password (Hidden initially) -->
                <form id="step-2-form" class="hidden">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="otp-code" class="form-label">Verification Code (6 Digits)</label>
                        <input type="text" id="otp-code" class="form-input" placeholder="000000" maxlength="6" style="letter-spacing: 0.2rem; font-size: 1.2rem; text-align: center;" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 1rem;">
                         <label for="new-password" class="form-label">New Password</label>
                         <input type="password" id="new-password" class="form-input" placeholder="Min. 8 characters" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 1.5rem;">
                         <label for="confirm-password" class="form-label">Confirm Password</label>
                         <input type="password" id="confirm-password" class="form-input" placeholder="Re-enter password" required>
                    </div>

                    <div id="step-2-message" class="auth-message-container"></div>

                    <button type="submit" class="btn btn-primary btn-full">
                        Reset Password
                    </button>
                    
                    <div style="text-align: center; margin-top: 1rem;">
                        <button type="button" id="back-to-step-1" style="background: none; border: none; color: #6b7280; font-size: 0.875rem; cursor: pointer;">Back to Email</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `;
}