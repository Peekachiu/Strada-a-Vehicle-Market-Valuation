export function renderRoadTaxPage(container) {
    container.innerHTML = `
    <div class="container" style="padding-top: 4rem; padding-bottom: 4rem;">
      <div class="form-card fade-in-up">
        <h2 class="auth-title">Road Tax Calculator</h2>
        <p class="auth-sub">Estimate your annual Malaysia Road Tax.</p>

        <form id="roadtax-form" class="auth-form">
          <!-- Engine Capacity -->
          <div class="form-group">
            <label for="rt-cc" class="form-label">Engine Capacity (cc)</label>
            <input type="number" id="rt-cc" class="form-input" placeholder="e.g. 1500" required>
          </div>

          <!-- Region -->
          <div class="form-group">
            <label for="rt-region" class="form-label">Region</label>
            <div class="select-wrapper">
              <select id="rt-region" class="form-input">
                <option value="peninsular">Peninsular Malaysia</option>
                <option value="east">Sabah & Sarawak</option>
                <option value="langkawi">Langkawi / Pangkor / Labuan</option>
              </select>
            </div>
          </div>

          <!-- Vehicle Type -->
          <div class="form-group">
            <label for="rt-type" class="form-label">Vehicle Type</label>
            <div class="select-wrapper">
              <select id="rt-type" class="form-input">
                <option value="saloon">Saloon (Sedan, Hatchback, Wagon)</option>
                <option value="non_saloon">Non-Saloon (SUV, MPV, Pickup)</option>
              </select>
            </div>
          </div>

          <!-- Ownership -->
          <div class="form-group">
            <label for="rt-ownership" class="form-label">Ownership</label>
            <div class="select-wrapper">
              <select id="rt-ownership" class="form-input">
                <option value="private">Private Individual</option>
                <option value="company">Company Registered</option>
              </select>
            </div>
          </div>
        </form>

        <!-- Results Section -->
        <div id="roadtax-results" class="calculator-results hidden">
          <div class="result-divider"></div>
          <div class="result-row">
            <span class="result-label">Base Rate</span>
            <span class="result-value" id="res-base">RM 0.00</span>
          </div>
          <div class="result-row">
            <span class="result-label">Progressive Rate</span>
            <span class="result-value" id="res-progressive">RM 0.00</span>
          </div>
          <div class="result-row">
            <span class="result-label">Total Annual Road Tax</span>
            <span class="result-value highlight" id="res-total-tax">RM 0.00</span>
          </div>
           <div class="result-row" id="company-surcharge-row" style="display:none;">
            <span class="result-label" style="font-size: 0.8rem;">(Includes Company Rate Adjustment)</span>
          </div>
        </div>

      </div>
    </div>
  `;
}
