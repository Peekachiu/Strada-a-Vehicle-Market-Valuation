/**
 * Renders the Insurance Estimator page.
 */
export function renderInsurancePage(container) {
    container.innerHTML = `
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="valuation-header animate-fade-up">
        <h1 class="auth-title" style="text-align: left; font-size: 2.25rem;">Insurance Estimator</h1>
        <p class="auth-sub" style="text-align: left; margin-bottom: 0;">
          Estimate your annual motor insurance premium
        </p>
      </div>

      <div class="valuation-page-grid">
        <!-- Input Form -->
        <div id="insurance-form-container" class="form-card animate-fade-up stagger-1">
          <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 1.5rem;">Vehicle Details</h3>
          <form id="insurance-form" class="auth-form">
            
            <div class="form-group">
              <label for="ins-market-value" class="form-label">Market Value (Sum Insured)</label>
              <div class="input-with-icon">
                <span class="input-icon">RM</span>
                <input id="ins-market-value" type="number" class="form-input with-icon" placeholder="e.g. 50000" required min="10000">
              </div>
            </div>

            <div class="form-group">
              <label for="ins-location" class="form-label">Location</label>
              <select id="ins-location" class="form-input">
                <option value="west">West Malaysia (Peninsular)</option>
                <option value="east">East Malaysia (Sabah/Sarawak)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="ins-ncd" class="form-label">No Claim Discount (NCD)</label>
              <select id="ins-ncd" class="form-input">
                <option value="0">0% (First Year / Claim Made)</option>
                <option value="25">25% (1st Year Renewal)</option>
                <option value="30">30% (2nd Year Renewal)</option>
                <option value="38.33">38.33% (3rd Year Renewal)</option>
                <option value="45">45% (4th Year Renewal)</option>
                <option value="55">55% (5th Year Renewal & Beyond)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="ins-cc" class="form-label">Engine Capacity (cc)</label>
              <input id="ins-cc" type="number" class="form-input" placeholder="e.g. 1500" required min="0">
              <p class="text-muted-foreground" style="font-size: 0.8rem; margin-top: 0.5rem;">Required for accurate base rate calculation.</p>
            </div>

            <button type="submit" class="btn btn-primary btn-full">
              Calculate Premium
              <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
        </div>

        <!-- Results Display -->
        <div id="insurance-results-container" class="animate-fade-up stagger-2">
           <div class="valuation-placeholder form-card">
              <div class="valuation-placeholder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 class="auth-title" style="font-size: 1.25rem;">Estimate Your Premium</h3>
              <p class="auth-sub" style="font-size: 1rem; max-width: 350px;">
                Enter your vehicle details to see an estimated breakdown of your annual insurance premium.
              </p>
            </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the insurance calculation results.
 */
export function renderInsuranceResults(container, data) {
    const {
        grossPremium,
        ncdAmount,
        premiumAfterNcd,
        serviceTax,
        stampDuty,
        total
    } = data;

    container.innerHTML = `
    <div class="form-card">
      <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 1.5rem;">Estimated Premium</h3>
      
      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Gross Premium</span>
        <span style="font-weight: 600;">RM ${grossPremium.toFixed(2)}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">NCD Deduction (${data.ncdPercent}%)</span>
        <span style="font-weight: 600; color: #dc2626;">- RM ${ncdAmount.toFixed(2)}</span>
      </div>

      <div style="height: 1px; background: #e5e7eb; margin: 1rem 0;"></div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Premium after NCD</span>
        <span style="font-weight: 600;">RM ${premiumAfterNcd.toFixed(2)}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Service Tax (8%)</span>
        <span style="font-weight: 600;">RM ${serviceTax.toFixed(2)}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Stamp Duty</span>
        <span style="font-weight: 600;">RM ${stampDuty.toFixed(2)}</span>
      </div>

      <div style="height: 1px; background: #e5e7eb; margin: 1rem 0;"></div>

      <div class="result-row" style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 1.125rem; font-weight: 600;">Total Payable</span>
        <span style="font-size: 1.5rem; font-weight: 700; color: #2563eb;">RM ${total.toFixed(2)}</span>
      </div>
      
      <div class="info-box" style="margin-top: 1.5rem; background: #f3f4f6; padding: 1rem; border-radius: 8px; font-size: 0.875rem; color: #4b5563;">
        <p><strong>Note:</strong> This is an estimation for a standard comprehensive policy. Actual premiums may vary based on insurer, additional coverage (windscreen, flood, etc.), and driver profile.</p>
      </div>
    </div>
  `;
}
