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
    event.preventDefault(); // Stop the form from submitting

    // --- 5. GET DATA USING THE CORRECT IDs ---
    const make = this.main.querySelector('#val-make').value;
    const model = this.main.querySelector('#val-model').value;
    const year = this.main.querySelector('#val-year').value;
    const mileage = this.main.querySelector('#val-mileage').value;
    
    // (We're ignoring the other fields for the mock API, but you can get them here)
    
    // 6. Get the auth token
    const token = this.getAuthToken();
    if (!token) {
      alert('You are not logged in. Redirecting to login.');
      window.location.hash = 'login';
      return;
    }

    // 7. Show a loading state
    this.showLoading();

    try {
      // 8. Send the fetch request to your Django API
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
          year: parseInt(year), 
          mileage: parseInt(mileage)
        }),
      });

      if (response.ok) {
        // We got our mock price!
        const data = await response.json();
        
        // --- 6. USE YOUR NEW RENDER FUNCTION ---
        // We create a "vehicle" object to match what renderValuationResults expects
        const resultData = {
          basePrice: data.estimated_price - 2000,
          marketValue: data.estimated_price,
          lowRange: data.estimated_price - 3000,
          highRange: data.estimated_price + 3000,
          vehicle: { year, make, model },
          factors: { condition: 0.9, mileage: 0.8, age: 0.7, demand: 1.1 } // Mock factors
        };
        renderValuationResults(this.resultsContainer, resultData);

      } else if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        window.location.hash = 'login';
      } else {
        this.showError('An error occurred. Please try again.');
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