// --- 1. IMPORT THE RENDER FUNCTIONS ---
import { 
  renderValuationForm, 
  renderValuationPlaceholder, 
  renderValuationResults 
} from '../views/valuationView.js';

export class ValuationController {
  /**
   * Initializes the controller.
   * @param {HTMLElement} main The <main> element.
   */
  constructor(main) {
    this.main = main;

    // --- 2. FIND THE CONTAINERS (from renderValuationPage) ---
    this.formContainer = this.main.querySelector('#valuation-form-container');
    this.resultsContainer = this.main.querySelector('#valuation-results-container');
    
    // Bind 'this' to our handler
    this.handleEstimate = this.handleEstimate.bind(this);
  }

  /**
   * Renders the form/placeholder and attaches listeners.
   * This is called by app.js.
   */
  init() {
    // --- 3. RENDER THE FORM AND PLACEHOLDER ---
    if (this.formContainer) {
      renderValuationForm(this.formContainer);
    } else {
      console.error('Valuation form container not found');
    }
    
    if (this.resultsContainer) {
      renderValuationPlaceholder(this.resultsContainer);
    } else {
      console.error('Valuation results container not found');
    }

    // --- 4. FIND THE FORM (after it's been rendered) ---
    this.form = this.main.querySelector('#valuation-form');

    if (this.form) {
      this.form.addEventListener('submit', this.handleEstimate);
    } else {
      console.error('Valuation form not found after render');
    }
  }

  /**
   * Handles the valuation form submission.
   */
  async handleEstimate(event) {
    event.preventDefault(); 

    // 1. Get ALL data from the form using the correct IDs from valuationView.js
    const make = this.main.querySelector('#val-make').value;
    const model = this.main.querySelector('#val-model').value;
    const year = this.main.querySelector('#val-year').value;
    const mileage = this.main.querySelector('#val-mileage').value;
    
    // --- NEW FIELDS REQUIRED BY MODEL ---
    const condition = this.main.querySelector('#val-condition').value;     // e.g., "Good"
    const transmission = this.main.querySelector('#val-transmission').value; // e.g., "Automatic"
    const fuel = this.main.querySelector('#val-fuel').value;               // e.g., "Petrol"
    
    // 2. Get the auth token
    const token = this.getAuthToken();
    if (!token) {
      alert('You are not logged in. Redirecting to login.');
      window.location.hash = 'login';
      return;
    }

    this.showLoading();

    try {
      // 3. Send to Django
      const response = await fetch('/api/estimate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          make: make,
          model: model,
          year: year,
          mileage: mileage,
          // Send the new fields
          condition: condition, 
          transmission: transmission,
          fuel_type: fuel // Backend expects 'fuel_type', make sure names match
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 4. Render Results
        const resultData = {
          basePrice: data.estimated_price, // Simplification for now
          marketValue: data.estimated_price,
          lowRange: data.estimated_price * 0.95, // -5%
          highRange: data.estimated_price * 1.05, // +5%
          vehicle: { year, make, model },
          factors: { condition: 0.9, mileage: 0.8, age: 0.7, demand: 1.1 } // Mock factors
        };
        renderValuationResults(this.resultsContainer, resultData);

      } else if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        window.location.hash = 'login';
      } else {
        const err = await response.json();
        this.showError(err.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Network error:', error);
      this.showError('A network error occurred. Please try again.');
    }
  }

  /**
   * Shows a loading message.
   */
  showLoading() {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = `<div class="form-card" style="padding: 2rem; text-align: center;"><p class="auth-sub">Getting your estimate...</p></div>`;
  }

  /**
   * Shows an error message.
   */
  showError(message) {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = `<div class="form-card" style="padding: 2rem; text-align: center;"><p style="color: red;">${message}</p></div>`;
  }

  // --- Helper Functions ---

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}