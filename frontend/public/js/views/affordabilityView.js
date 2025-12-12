/**
 * Renders the Affordability Calculator page.
 */
export function renderAffordabilityPage(container) {
    container.innerHTML = `
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="valuation-header animate-fade-up">
        <h1 class="auth-title" style="text-align: left; font-size: 2.25rem;">Affordability Calculator</h1>
        <p class="auth-sub" style="text-align: left; margin-bottom: 0;">
          Find out the maximum car price you can afford based on your monthly budget.
        </p>
      </div>

      <div class="valuation-page-grid">
        <!-- Input Form -->
        <div id="affordability-form-container" class="form-card animate-fade-up stagger-1">
          <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 1.5rem;">Your Budget</h3>
          <form id="affordability-form" class="auth-form">
            
            <div class="form-group">
              <label for="aff-budget" class="form-label">Monthly Budget</label>
              <div class="input-with-icon">
                <span class="input-icon">RM</span>
                <input id="aff-budget" type="number" class="form-input with-icon" placeholder="e.g. 1200" required min="100">
              </div>
            </div>

            <div class="form-group">
              <label for="aff-downpayment" class="form-label">Down Payment</label>
              <select id="aff-downpayment" class="form-input">
                <option value="0">0% (Full Loan)</option>
                <option value="10" selected>10% (Standard)</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </select>
            </div>

            <div class="form-group">
              <label for="aff-term" class="form-label">Loan Period (Years)</label>
              <select id="aff-term" class="form-input">
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
                <option value="7">7 Years</option>
                <option value="9" selected>9 Years</option>
              </select>
            </div>

            <div class="form-group">
              <label for="aff-rate" class="form-label">Interest Rate (%)</label>
              <input id="aff-rate" type="number" class="form-input" placeholder="e.g. 3.5" value="3.5" step="0.1" required min="0">
            </div>

            <button type="submit" class="btn btn-primary btn-full">
              Calculate Affordability
              <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
        </div>

        <!-- Results Display -->
        <div id="affordability-results-container" class="animate-fade-up stagger-2">
           <div class="valuation-placeholder form-card">
              <div class="valuation-placeholder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              </div>
              <h3 class="auth-title" style="font-size: 1.25rem;">What can you buy?</h3>
              <p class="auth-sub" style="font-size: 1rem; max-width: 350px;">
                Enter your budget details to see the maximum car price you can afford.
              </p>
            </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the affordability calculation results.
 */
export function renderAffordabilityResults(container, data) {
    const {
        maxPrice,
        loanAmount,
        downPaymentAmount,
        totalInterest
    } = data;

    container.innerHTML = `
    <div class="form-card">
      <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 0.5rem;">You can afford a car up to</h3>
      
      <div style="margin-bottom: 2rem;">
        <span style="font-size: 2.5rem; font-weight: 800; color: #2563eb; line-height: 1;">RM ${maxPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Loan Amount</span>
        <span style="font-weight: 600;">RM ${loanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Down Payment (${data.downPaymentPercent}%)</span>
        <span style="font-weight: 600;">RM ${downPaymentAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Total Interest Payable</span>
        <span style="font-weight: 600;">RM ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>
      
      <div class="info-box" style="margin-top: 1.5rem; background: #f3f4f6; padding: 1rem; border-radius: 8px; font-size: 0.875rem; color: #4b5563;">
        <p><strong>Tip:</strong> This calculation assumes a standard hire purchase loan. Don't forget to budget for insurance, road tax, and maintenance!</p>
      </div>
      
      <button class="btn btn-outline btn-full" style="margin-top: 1.5rem;" onclick="window.location.hash='valuation'">
        Check Market Prices
      </button>
    </div>
  `;
}
