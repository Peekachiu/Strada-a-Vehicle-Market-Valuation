export function renderCalculatorPage(container) {
    container.innerHTML = `
    <div class="container" style="padding-top: 4rem; padding-bottom: 4rem;">
      <div class="form-card fade-in-up">
        <h2 class="auth-title">Loan Calculator</h2>
        <p class="auth-sub">Estimate your monthly car payments.</p>

        <form id="calculator-form" class="auth-form">
          <!-- Vehicle Price -->
          <div class="form-group">
            <label for="calc-price" class="form-label">Vehicle Price (RM)</label>
            <input type="number" id="calc-price" class="form-input" placeholder="e.g. 100000" required>
          </div>

          <!-- Down Payment (Percentage) -->
          <div class="form-group">
            <label for="calc-down-percent" class="form-label">Down Payment (%)</label>
            <div class="select-wrapper">
              <select id="calc-down-percent" class="form-input">
                <option value="0">0%</option>
                <option value="10" selected>10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
              </select>
            </div>
            <p class="form-hint" id="calc-down-amount-display">Down Payment Amount: RM 0</p>
          </div>

          <!-- Interest Rate -->
          <div class="form-group">
            <label for="calc-interest" class="form-label">Interest Rate (%)</label>
            <input type="number" id="calc-interest" class="form-input" placeholder="e.g. 3.5" value="3.5" step="0.1" required>
          </div>

          <!-- Loan Term -->
          <div class="form-group">
            <label for="calc-term" class="form-label">Loan Term (Years)</label>
            <div class="select-wrapper">
              <select id="calc-term" class="form-input">
                <option value="1">1 Year</option>
                <option value="3">3 Years</option>
                <option value="5" selected>5 Years</option>
                <option value="7">7 Years</option>
                <option value="9">9 Years</option>
              </select>
            </div>
          </div>
        </form>

        <!-- Results Section -->
        <div id="calculator-results" class="calculator-results hidden">
          <div class="result-divider"></div>
          <div class="result-row">
            <span class="result-label">Monthly Payment</span>
            <span class="result-value highlight" id="res-monthly">RM 0.00</span>
          </div>
          <div class="result-row">
            <span class="result-label">Total Interest</span>
            <span class="result-value" id="res-interest">RM 0.00</span>
          </div>
          <div class="result-row">
            <span class="result-label">Total Payment</span>
            <span class="result-value" id="res-total">RM 0.00</span>
          </div>
        </div>

      </div>
    </div>
  `;
}
