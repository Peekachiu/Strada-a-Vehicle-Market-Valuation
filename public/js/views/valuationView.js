/**
 * Renders the main structure of the valuation page.
 */
export function renderValuationPage(container) {
  container.innerHTML = `
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="valuation-header">
        <h1 class="auth-title" style="text-align: left; font-size: 2.25rem;">Vehicle Valuation</h1>
        <p class="auth-sub" style="text-align: left; margin-bottom: 0;">
          Get instant, accurate market valuations for any vehicle
        </p>
      </div>

      <div class="valuation-page-grid">
        <div id="valuation-form-container" class="form-card">
          </div>

        <div id="valuation-results-container">
          </div>
      </div>

      <div class="valuation-tabs-container">
        <div class="valuation-tabs-list">
          <button id="tab-trends" class="valuation-tab active" data-tab="trends">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"></line><polyline points="6 10 12 4 18 10"></polyline></svg>
            Market Trends
          </button>
          <button id="tab-comparison" class="valuation-tab" data-tab="comparison">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Comparison
          </button>
        </div>
        
        <div id="valuation-tabs-content" class="valuation-tab-content">
          </div>
      </div>

      <div class="valuation-info-cards">
        <div class="info-card">
          <h3 class="info-card-title">Accurate Valuations</h3>
          <p class="info-card-desc">
            Our algorithm analyzes market data, condition, mileage, and demand to provide precise valuations
          </p>
        </div>
        <div class="info-card">
          <h3 class="info-card-title">Real-Time Data</h3>
          <p class="info-card-desc">
            Market trends and pricing updated regularly to reflect current market conditions
          </p>
        </div>
        <div class="info-card">
          <h3 class="info-card-title">Comprehensive Analysis</h3>
          <p class="info-card-desc">
            Detailed breakdowns show how each factor impacts your vehicle's market value
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the HTML for the valuation form itself (With Brand Modal Trigger).
 */
export function renderValuationForm(formContainer) {
  formContainer.innerHTML = `
    <h3 class="auth-title" style="text-align: left; font-size: 1.5rem; margin-bottom: 1.5rem;">Vehicle Details</h3>
    <form id="valuation-form" class="auth-form">
      
      <div class="form-group">
        <label for="val-make-display" class="form-label">Make</label>
        <div class="input-with-icon" id="make-input-trigger" style="cursor: pointer;">
           <span class="input-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>
           </span>
           <input id="val-make-display" type="text" class="form-input with-icon" placeholder="Select Brand" readonly style="cursor: pointer; background: transparent;">
           <input id="val-make" name="make" type="hidden">
        </div>
      </div>

      <div class="form-group">
        <label for="val-model" class="form-label">Model</label>
        <input id="val-model" name="model" type="text" class="form-input" required placeholder="e.g. Corolla" />
      </div>

      <div class="form-group">
        <label for="val-year" class="form-label">Year</label>
        <input id="val-year" name="year" type="number" class="form-input" required placeholder="e.g. 2018" min="1950" max="${new Date().getFullYear()}" />
      </div>

      <div class="form-group">
        <label for="val-mileage" class="form-label">Mileage (km)</label>
        <input id="val-mileage" name="mileage" type="number" class="form-input" required placeholder="e.g. 50000" />
      </div>

      <div class="form-group">
        <label for="val-condition" class="form-label">Condition</label>
        <select id="val-condition" name="condition" class="form-input">
          <option value="excellent">Excellent</option>
          <option value="good" selected>Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="val-transmission" class="form-label">Transmission</label>
        <select id="val-transmission" name="transmission" class="form-input">
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div class="form-group">
        <label for="val-fuel" class="form-label">Fuel Type</label>
        <select id="val-fuel" name="fuelType" class="form-input">
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      <button class="btn btn-primary btn-full" type="submit">
        Calculate Valuation
        <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </form>
  `;
}

/**
 * Renders the Brand Selection Modal.
 */
export function renderBrandModal(container) {
  const modalHTML = `
    <div id="brand-modal" class="modal-overlay hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Select Vehicle Make</h3>
          <button type="button" id="close-brand-modal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="brand-grid">
            <div class="brand-card" data-brand="Honda">
              <div class="brand-icon-form">
                <img src="static/assets/images/honda_logo.jpg" alt="Honda">
              </div>
              <span>Honda</span>
            </div>
            <div class="brand-card" data-brand="Toyota">
              <div class="brand-icon-form">
                <img src="static/assets/images/toyota_logo.jpg" alt="Honda">
              </div>
              <span>Toyota</span>
            </div>
            <div class="brand-card" data-brand="Nissan">
              <div class="brand-icon-form">
                <img src="static/assets/images/nissan_logo.png" alt="Honda">
              </div>
              <span>Nissan</span>
            </div>
            <div class="brand-card" data-brand="Mazda">
              <div class="brand-icon-form">
                <img src="static/assets/images/mazda_logo.jpeg" alt="Honda">
              </div>
              <span>Mazda</span>
            </div>
            <div class="brand-card" data-brand="Lexus">
              <div class="brand-icon-form">
                <img src="static/assets/images/lexus_logo.webp" alt="Honda">
              </div>
              <span>Lexus</span>
            </div>
            <div class="brand-card disabled" data-brand="BMW">
              <div class="brand-icon-form">B</div>
              <span>BMW</span>
            </div>
            <div class="brand-card disabled" data-brand="Mercedes">
              <div class="brand-icon-form">M</div>
              <span>Mercedes</span>
            </div>
             <div class="brand-card disabled" data-brand="Audi">
              <div class="brand-icon-form">A</div>
              <span>Audi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Renders the placeholder in the results column.
 */
export function renderValuationPlaceholder(resultContainer) {
  resultContainer.innerHTML = `
    <div class="valuation-placeholder form-card">
      <div class="valuation-placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      </div>
      <h3 class="auth-title" style="font-size: 1.25rem;">No Valuation Yet</h3>
      <p class="auth-sub" style="font-size: 1rem; max-width: 350px;">
        Fill out the vehicle details form to get an instant market valuation with detailed price analysis
      </p>
    </div>
  `;
}

/**
 * Renders the valuation results card.
 */
export function renderValuationResults(resultContainer, data) {
  const { basePrice, marketValue, lowRange, highRange, factors, vehicle } = data;
  
  resultContainer.innerHTML = `
    <div class="valuation-results-card form-card">
      <div class="result-header">
        <p class="result-vehicle">${vehicle.year} ${vehicle.make} ${vehicle.model}</p>
        <h2 class="result-value">RM ${marketValue.toLocaleString()}</h2>
        <p class="result-range">
          Est. Range: RM ${lowRange.toLocaleString()} - RM ${highRange.toLocaleString()}
        </p>
      </div>
      
      <div class="result-factors">
        <h4 class="result-factors-title">Valuation Factors</h4>
        <div class="factor-item">
          <span>Base Price</span>
          <span class="factor-value">RM ${basePrice.toLocaleString()}</span>
        </div>
        <div class="factor-item">
          <span>Condition Adjustment</span>
          <span class="factor-value">${(factors.condition * 100).toFixed(0)}%</span>
        </div>
        <div class="factor-item">
          <span>Mileage Adjustment</span>
          <span class="factor-value">${(factors.mileage * 100).toFixed(0)}%</span>
        </div>
        <div class="factor-item">
          <span>Age Adjustment</span>
          <span class="factor-value">${(factors.age * 100).toFixed(0)}%</span>
        </div>
        <div class="factor-item">
          <span>Market Demand</span>
          <span class="factor-value">${(factors.demand * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the content for the selected tab.
 */
export function renderTabContent(tabContainer, tabName, data) {
  if (tabName === 'trends') {
    tabContainer.innerHTML = `
      <div class="form-card">
        <h3 class="auth-title" style="font-size: 1.5rem; text-align: left;">Market Trends</h3>
        <p class="text-muted-foreground">Historical valuation data for ${data ? `a ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}` : 'this vehicle'} will be shown here. This feature is coming soon.</p>
        </div>
    `;
  } else if (tabName === 'comparison') {
    tabContainer.innerHTML = `
      <div class="form-card">
        <h3 class="auth-title" style="font-size: 1.5rem; text-align: left;">Market Comparison</h3>
        <p class="text-muted-foreground">A comparison of ${data ? `a ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}` : 'this vehicle'} against similar models in the market will be shown here. This feature is coming soon.</p>
        </div>
    `;
  }
}