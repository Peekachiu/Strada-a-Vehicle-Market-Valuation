import { 
  renderValuationForm, 
  renderValuationPlaceholder, 
  renderValuationResults,
  renderBrandModal,
  renderModelModal
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
// ... inside ValuationController class ...

init() {
    // 1. Render Form & Placeholder (Same as before)
    if (this.formContainer) {
      renderValuationForm(this.formContainer);
    }
    if (this.resultsContainer) {
      renderValuationPlaceholder(this.resultsContainer);
    }

    // 2. NEW: Render the Brand Modal
    // Check if modal already exists to prevent duplicates
    if (!document.getElementById('brand-modal')) {
       renderBrandModal(document.body);
    }

    // 3. Attach Listeners (Same as before + NEW Modal logic)
    this.form = this.main.querySelector('#valuation-form');
    if (this.form) {
      this.form.addEventListener('submit', this.handleEstimate);

      // --- NEW MODAL LOGIC ---
      this.setupModal();
      this.setupModelModal();
      this.setupSequentialInputs();
    }
}

setupBrandModal() {
      const trigger = this.main.querySelector('#make-input-trigger');
      const modal = document.getElementById('brand-modal');
      const closeBtn = document.getElementById('close-brand-modal');
      const displayInput = this.main.querySelector('#val-make-display');
      const hiddenInput = this.main.querySelector('#val-make');
      
      // Note: We select using the NEW class name
      const brandCards = document.querySelectorAll('.modal-brand-card');
      
      // Model inputs to reset
      const modelDisplay = this.main.querySelector('#val-model-display');
      const modelHidden = this.main.querySelector('#val-model');
      const modelTrigger = this.main.querySelector('#model-input-trigger');

      trigger.addEventListener('click', () => {
          modal.classList.remove('hidden');
          // Highlight currently selected brand
          const currentBrand = hiddenInput.value;
          brandCards.forEach(card => {
             if (card.getAttribute('data-brand') === currentBrand) {
                 card.classList.add('selected');
             } else {
                 card.classList.remove('selected');
             }
          });
      });

      closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

      brandCards.forEach(card => {
          card.addEventListener('click', (e) => {
              // IMPORTANT: e.currentTarget ensures we get the .modal-brand-card element
              // even if the user clicked on the image or text inside it.
              const clickedCard = e.currentTarget;

              if (clickedCard.classList.contains('disabled')) return;

              // --- 1. VISUAL SELECTION ---
              brandCards.forEach(c => c.classList.remove('selected'));
              clickedCard.classList.add('selected');
              
              // --- 2. GET DATA ---
              const brand = clickedCard.getAttribute('data-brand');
              console.log("Selected Brand:", brand); // Debug log

              // --- 3. UPDATE INPUTS ---
              if (displayInput && hiddenInput) {
                  displayInput.value = brand;
                  hiddenInput.value = brand;
              } else {
                  console.error("Make inputs not found!");
              }
              
              // 4. Reset & Unlock Model
              if (modelDisplay && modelHidden && modelTrigger) {
                  modelDisplay.value = '';
                  modelDisplay.placeholder = "Select Model";
                  modelHidden.value = '';
                  modelTrigger.classList.remove('is-disabled');
              }
              
              // 5. Reset future steps
              this.resetFormStartingFrom('year'); 

              // --- 6. DELAY CLOSING ---
              setTimeout(() => {
                  modal.classList.add('hidden');
              }, 300);
          });
      });

      modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.add('hidden');
      });
  }

setupModelModal() {
      const trigger = this.main.querySelector('#model-input-trigger');
      const brandInput = this.main.querySelector('#val-make');
      const displayInput = this.main.querySelector('#val-model-display');
      const hiddenInput = this.main.querySelector('#val-model');
      const yearInput = this.main.querySelector('#val-year');

      trigger.addEventListener('click', () => {
          const selectedBrand = brandInput.value;
          
          // 1. Check if brand is selected first
          if (!selectedBrand) {
              alert("Please select a Brand first.");
              return;
          }

          // 2. Render and Open the Model Modal dynamically
          renderModelModal(selectedBrand);
          const modal = document.getElementById('model-modal');
          const closeBtn = document.getElementById('close-model-modal');
          const modelCards = document.querySelectorAll('.modal-model-card');
          
          // Show modal
          modal.classList.remove('hidden');

          // Close listeners
          closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
          modal.addEventListener('click', (e) => {
              if (e.target === modal) modal.classList.add('hidden');
          });

          // Selection listeners
          modelCards.forEach(card => {
              card.addEventListener('click', () => {
                  const model = card.getAttribute('data-model');
                  displayInput.value = model;
                  hiddenInput.value = model;

                  // Reset & Unlock Year
                  yearInput.disabled = false;
                  yearInput.placeholder = 'e.g. Year';
                  yearInput.disabled = false;

                  modal.classList.add('hidden');
              });
          });
      });
  }

// --- NEW: Handles Year -> Mileage -> Rest ---
  setupSequentialInputs() {
      const yearInput = this.main.querySelector('#val-year');
      const mileageInput = this.main.querySelector('#val-mileage');
      const others = [
          this.main.querySelector('#val-condition'),
          this.main.querySelector('#val-transmission'),
          this.main.querySelector('#val-fuel')
      ];
      const submitBtn = this.main.querySelector('#val-submit-btn');

      // 1. Year Input Logic
      yearInput.addEventListener('input', (e) => {
          if (e.target.value.length === 4) {
              // If year looks valid (4 digits), unlock mileage
              mileageInput.disabled = false;
              mileageInput.placeholder = "e.g. 50000";
          }
      });

      // 2. Mileage Input Logic
      mileageInput.addEventListener('input', (e) => {
          if (e.target.value.length > 0) {
              // Unlock everything else
              others.forEach(input => input.disabled = false);
              submitBtn.classList.remove('is-disabled');
          }
      });
  }
  
  // --- NEW Helper to reset form if user goes back ---
  resetFormStartingFrom(field) {
      const yearInput = this.main.querySelector('#val-year');
      const mileageInput = this.main.querySelector('#val-mileage');
      const others = [
          this.main.querySelector('#val-condition'),
          this.main.querySelector('#val-transmission'),
          this.main.querySelector('#val-fuel')
      ];
      const submitBtn = this.main.querySelector('#val-submit-btn');

      if (field === 'year') {
          yearInput.value = '';
          yearInput.disabled = true;
          yearInput.placeholder = "Select Model First";
      }
      
      // Always reset mileage and below if we reset year
      mileageInput.value = '';
      mileageInput.disabled = true;
      mileageInput.placeholder = "Enter Year First";
      
      others.forEach(input => {
          input.disabled = true;
          // Optional: reset select to default
          // input.selectedIndex = 0; 
      });
      
      submitBtn.classList.add('is-disabled');
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