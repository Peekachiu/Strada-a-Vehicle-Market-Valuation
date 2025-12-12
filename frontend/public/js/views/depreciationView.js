/**
 * Renders the Depreciation Simulator page.
 */
export function renderDepreciationPage(container) {
    container.innerHTML = `
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="valuation-header animate-fade-up">
        <h1 class="auth-title" style="text-align: left; font-size: 2.25rem;">Depreciation Simulator</h1>
        <p class="auth-sub" style="text-align: left; margin-bottom: 0;">
          Visualize how your car's value changes over time.
        </p>
      </div>

      <div class="valuation-page-grid">
        <!-- Input Form -->
        <div id="depreciation-form-container" class="form-card animate-fade-up stagger-1">
          <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 1.5rem;">Vehicle Details</h3>
          <form id="depreciation-form" class="auth-form">
            
            <div class="form-group">
              <label for="dep-price" class="form-label">Current Market Price</label>
              <div class="input-with-icon">
                <span class="input-icon">RM</span>
                <input id="dep-price" type="number" class="form-input with-icon" placeholder="e.g. 100000" required min="1000">
              </div>
            </div>

            <div class="form-group">
              <label for="dep-type" class="form-label">Vehicle Type</label>
              <select id="dep-type" class="form-input">
                <option value="standard">Standard / Asian (Holds value better)</option>
                <option value="luxury">Luxury / Continental (Higher depreciation)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dep-period" class="form-label">Ownership Period</label>
              <select id="dep-period" class="form-input">
                <option value="3">3 Years</option>
                <option value="5" selected>5 Years</option>
                <option value="7">7 Years</option>
                <option value="10">10 Years</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary btn-full">
              Simulate Depreciation
              <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
        </div>

        <!-- Results Display -->
        <div id="depreciation-results-container" class="animate-fade-up stagger-2">
           <div class="valuation-placeholder form-card">
              <div class="valuation-placeholder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
              </div>
              <h3 class="auth-title" style="font-size: 1.25rem;">See the Future Value</h3>
              <p class="auth-sub" style="font-size: 1rem; max-width: 350px;">
                Enter your car details to simulate its future market value curve.
              </p>
            </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the depreciation simulation results.
 */
export function renderDepreciationResults(container, data) {
    const {
        futureValue,
        totalLoss,
        period
    } = data;

    container.innerHTML = `
    <div class="form-card">
      <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 0.5rem;">In ${period} Years</h3>
      
      <div style="margin-bottom: 1.5rem;">
        <p class="text-muted-foreground" style="margin-bottom: 0.25rem;">Estimated Value</p>
        <span style="font-size: 2.5rem; font-weight: 800; color: #2563eb; line-height: 1;">RM ${futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>

      <div class="result-row" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="text-muted-foreground">Total Value Lost</span>
        <span style="font-weight: 600; color: #dc2626;">- RM ${totalLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>

      <div style="height: 1px; background: #e5e7eb; margin: 1.5rem 0;"></div>

      <h4 style="font-weight: 600; margin-bottom: 1rem;">Depreciation Curve</h4>
      <div style="position: relative; height: 250px; width: 100%;">
        <canvas id="depreciationChart"></canvas>
      </div>
      
      <div class="info-box" style="margin-top: 1.5rem; background: #f3f4f6; padding: 1rem; border-radius: 8px; font-size: 0.875rem; color: #4b5563;">
        <p><strong>Note:</strong> This is a simulation based on average market depreciation rates. Actual resale value depends on condition, mileage, and market demand.</p>
      </div>
    </div>
  `;
}
