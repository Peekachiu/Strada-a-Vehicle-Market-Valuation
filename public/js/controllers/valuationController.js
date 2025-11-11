import { ValuationModel } from '../models/valuationModel.js';
import { 
  renderValuationForm, 
  renderValuationPlaceholder, 
  renderValuationResults,
  renderTabContent 
} from '../views/valuationView.js';

export class ValuationController {
  constructor(rootEl, opts = {}) {
    // This controller now expects the root of the *page*, not the form
    this.pageRoot = rootEl; 
    this.apiBase = opts.apiBase || '/api/estimate';
    this.model = new ValuationModel(this.apiBase);
    
    this.currentValuationData = null; // To store the latest valuation
    this.activeTab = 'trends'; // Default active tab
  }

  init() {
    // Find the containers rendered by the view
    this.formContainer = this.pageRoot.querySelector('#valuation-form-container');
    this.resultsContainer = this.pageRoot.querySelector('#valuation-results-container');
    this.tabsContentContainer = this.pageRoot.querySelector('#valuation-tabs-content');
    
    // Render initial content
    renderValuationForm(this.formContainer);
    renderValuationPlaceholder(this.resultsContainer);
    renderTabContent(this.tabsContentContainer, this.activeTab, null);

    // Find the form *after* it's rendered
    this.form = this.formContainer.querySelector('#valuation-form');
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.onSubmit(e));
    }
    
    // Bind tab clicks
    this.pageRoot.querySelectorAll('.valuation-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.onTabClick(e));
    });
  }
  
  onTabClick(e) {
    const newTabName = e.currentTarget.dataset.tab;
    if (newTabName === this.activeTab) return; // Do nothing if already active

    this.activeTab = newTabName;
    
    // Update active class on tabs
    this.pageRoot.querySelectorAll('.valuation-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === newTabName);
    });
    
    // Render new tab content
    renderTabContent(this.tabsContentContainer, this.activeTab, this.currentValuationData);
  }

  async onSubmit(e) {
    e.preventDefault();
    
    // Get all new form values
    const data = {
      make: this.form.querySelector('#val-make').value,
      model: this.form.querySelector('#val-model').value.trim(),
      year: this.form.querySelector('#val-year').value,
      mileage: this.form.querySelector('#val-mileage').value,
      condition: this.form.querySelector('#val-condition').value,
      transmission: this.form.querySelector('#val-transmission').value,
      fuelType: this.form.querySelector('#val-fuel').value,
    };

    if (!data.model || !data.year || !data.mileage) {
      console.warn('Please complete all fields.');
      // In a real app, show a user-friendly error
      return;
    }

    // Show a temporary loading state in the results box
    renderValuationResults(this.resultsContainer, { 
      marketValue: "...", 
      lowRange: "...", 
      highRange: "...", 
      basePrice: "...",
      factors: { condition: "...", mileage: "...", age: "...", demand: "..." },
      vehicle: data 
    });

    try {
      const result = await this.model.estimate(data);
      this.currentValuationData = result; // Store the result
      
      // Render the full results card
      renderValuationResults(this.resultsContainer, result);
      
      // Also update the active tab with the new data
      renderTabContent(this.tabsContentContainer, this.activeTab, result);
      
      document.dispatchEvent(new CustomEvent('valuation:completed', { detail: result }));
    } catch (err) {
      console.error(err);
      // If error, reset to placeholder
      renderValuationPlaceholder(this.resultsContainer);
    }
  }
}