// --- 1. DEFINE CAR DATA (Brand -> Models) ---
// You will update the image paths later.
export const carData = {
  "Honda": [
    { name: "Civic", img: "static/assets/images/civic.png" },
    { name: "City", img: "static/assets/images/city.webp" },
    { name: "Accord", img: "static/assets/images/accord.avif" },
    { name: "Jazz", img: "static/assets/images/jazz.avif" },
    { name: "CR-V", img: "static/assets/images/cr-v.png" },
    { name: "HR-V", img: "static/assets/images/hr-v.png" },
    { name: "BR-V", img: "static/assets/images/br-v.jpg" }
  ],
  "Toyota": [
    { name: "Vios", img: "static/assets/images/vios.png" },
    { name: "Corolla", img: "static/assets/images/corolla.png" },
    { name: "Camry", img: "static/assets/images/camry.avif" },
    { name: "Yaris", img: "static/assets/images/yaris.jpg" },
    { name: "Hilux", img: "static/assets/images/hilux.png" },
    { name: "Fortuner", img: "static/assets/images/fortuner.png" }
  ],
  "Nissan": [
    { name: "Almera", img: "static/assets/images/almera.jpg" },
    { name: "Serena", img: "static/assets/images/serena.png" },
    { name: "X-Trail", img: "static/assets/images/xtrail.png" },
    { name: "Navara", img: "static/assets/images/navara.jpg" }
  ],
  "Mazda": [
    { name: "Mazda2", img: "static/assets/images/mazda2.webp" },
    { name: "Mazda3", img: "static/assets/images/mazda3.webp" },
    { name: "Mazda6", img: "static/assets/images/mazda6.jpg" },
    { name: "CX-5", img: "static/assets/images/cx5.png" }
  ],
  "Lexus": [
    { name: "ES", img: "static/assets/images/es.avif" },
    { name: "IS", img: "static/assets/images/is.webp" },
    { name: "RX", img: "static/assets/images/rx.webp" },
    { name: "NX", img: "static/assets/images/nx.webp" }
  ]
};

/**
 * Renders the main structure of the valuation page.
 */
export function renderValuationPage(container) {
  container.innerHTML = `
    <div class="container" style="padding-top: 0.5rem; padding-bottom: 4rem;">
      <div class="valuation-header animate-fade-up">
        <h1 class="auth-title" style="text-align: left; font-size: 2.25rem;">Vehicle Valuation</h1>
        <p class="auth-sub" style="text-align: left; margin-bottom: 0;">
          Get instant, accurate market valuations for any vehicle
        </p>
      </div>

      <div class="valuation-page-grid">
        <div id="valuation-form-container" class="form-card animate-fade-up stagger-1">
          </div>

        <div id="valuation-results-container" class="animate-fade-up stagger-2">
          </div>
      </div>

      <div class="valuation-tabs-container animate-fade-up stagger-3">
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
        <div class="info-card reveal-on-scroll stagger-1">
          <h3 class="info-card-title">Accurate Valuations</h3>
          <p class="info-card-desc">
            Our algorithm analyzes market data, condition, mileage, and demand to provide precise valuations
          </p>
        </div>
        <div class="info-card reveal-on-scroll stagger-2">
          <h3 class="info-card-title">Real-Time Data</h3>
          <p class="info-card-desc">
            Market trends and pricing updated regularly to reflect current market conditions
          </p>
        </div>
        <div class="info-card reveal-on-scroll stagger-3">
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
           <input id="val-make-display" type="text" class="form-input with-icon" placeholder="Select Brand" readonly style="cursor: pointer; background: transparent; pointer-events: none;">
           <input id="val-make" name="make" type="hidden">
        </div>
      </div>

      <div class="form-group">
        <label for="val-model-display" class="form-label">Model</label>
        <div class="input-with-icon is-disabled" id="model-input-trigger" style="cursor: pointer;">
           <span class="input-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
           </span>
           <input id="val-model-display" type="text" class="form-input with-icon" placeholder="Select Brand First" readonly style="cursor: pointer; background: transparent;">
           <input id="val-model" name="model" type="hidden">
        </div>
      </div>

      <div class="form-group">
        <label for="val-year" class="form-label">Year</label>
        <input id="val-year" name="year" type="number" class="form-input" required placeholder="Select Model First" min="1950" max="${new Date().getFullYear()}" disabled />
      </div>

      <div class="form-group">
        <label for="val-mileage" class="form-label">Mileage (km)</label>
        <input id="val-mileage" name="mileage" type="number" class="form-input" required placeholder="Enter Year First" disabled />
      </div>

      <div class="form-group">
        <label for="val-condition" class="form-label">Condition</label>
        <select id="val-condition" name="condition" class="form-input" disabled>
          <option value="excellent">Excellent</option>
          <option value="good" selected>Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="val-transmission" class="form-label">Transmission</label>
        <select id="val-transmission" name="transmission" class="form-input" disabled>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div class="form-group">
        <label for="val-fuel" class="form-label">Fuel Type</label>
        <select id="val-fuel" name="fuelType" class="form-input" disabled>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      <button id="val-submit-btn" class="btn btn-primary btn-full is-disabled" type="submit">
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
  // Reusable Checkmark Icon (Hidden by default via CSS)
  const checkmarkHTML = `
    <div class="selected-checkmark">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  `;

  const modalHTML = `
    <!-- REMOVED INLINE STYLES - Relying on styles.css now -->
    <div id="brand-modal" class="modal-overlay hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Select Vehicle Make</h3>
          <p class="modal-subtitle">Choose the manufacturer of your vehicle</p>
          <button type="button" id="close-brand-modal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="brand-grid">
            
            <!-- Honda -->
            <div class="modal-brand-card" data-brand="Honda">
              ${checkmarkHTML}
              <div class="modal-brand-icon">
                <img src="static/assets/images/honda_logo.jpg" alt="Honda">
              </div>
              <span>Honda</span>
            </div>
            
            <!-- Toyota -->
            <div class="modal-brand-card" data-brand="Toyota">
              ${checkmarkHTML}
              <div class="modal-brand-icon">
                <img src="static/assets/images/toyota_logo.jpg" alt="Toyota">
              </div>
              <span>Toyota</span>
            </div>
            
            <!-- Nissan -->
            <div class="modal-brand-card" data-brand="Nissan">
              ${checkmarkHTML}
              <div class="modal-brand-icon">
                <img src="static/assets/images/nissan_logo.png" alt="Nissan">
              </div>
              <span>Nissan</span>
            </div>
            
            <!-- Mazda -->
            <div class="modal-brand-card" data-brand="Mazda">
              ${checkmarkHTML}
              <div class="modal-brand-icon">
                <img src="static/assets/images/mazda_logo.jpeg" alt="Mazda">
              </div>
              <span>Mazda</span>
            </div>
            
            <!-- Lexus -->
            <div class="modal-brand-card" data-brand="Lexus">
              ${checkmarkHTML}
              <div class="modal-brand-icon">
                <img src="static/assets/images/lexus_logo.webp" alt="Lexus">
              </div>
              <span>Lexus</span>
            </div>

            <!-- Disabled Brands -->
            <div class="modal-brand-card disabled" data-brand="BMW">
               <div class="modal-brand-icon">
                 <img src="static/assets/images/bmw_logo.png" alt="BMW">
               </div> 
               <span>BMW</span>
            </div>
             <div class="modal-brand-card disabled" data-brand="Mercedes">
               <div class="modal-brand-icon">
                 <img src="static/assets/images/mercedes_logo.png" alt="Mercedes">
               </div>
               <span>Mercedes</span>
            </div>
             <div class="modal-brand-card disabled" data-brand="Audi">
               <div class="modal-brand-icon">
                 <img src="static/assets/images/audi_logo.png" alt="Audi">
               </div>
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
 * Renders the Model Selection Modal (DYNAMIC).
 */
export function renderModelModal(brand) {
  // 1. Remove existing model modal if it exists (to prevent duplicates)
  const existingModal = document.getElementById('model-modal');
  if (existingModal) existingModal.remove();

  // 2. Get models for the selected brand from our data
  // Note: Make sure 'carData' is imported or defined at the top of this file!
  const models = carData[brand] || [];

  // 3. Generate HTML for model cards
  let modelsHTML = '';
  if (models.length > 0) {
    modelsHTML = models.map(m => `
      <div class="modal-model-card" data-model="${m.name}">
        <div class="modal-model-image">
           <img src="${m.img}" alt="${m.name}" onerror="this.style.display='none'">
        </div>
        <span>${m.name}</span>
      </div>
    `).join('');
  } else {
    modelsHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #666;">No models found for ${brand}. Please type manually.</p>`;
  }

  const modalHTML = `
    <div id="model-modal" class="modal-overlay hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Select ${brand} Model</h3>
          <button type="button" id="close-model-modal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="brand-grid"> ${modelsHTML}
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