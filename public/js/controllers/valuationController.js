import { ValuationModel } from '../models/valuationModel.js';
import { renderValuation, showResult } from '../views/valuationView.js';

export class ValuationController {
  constructor(rootEl, opts = {}) {
    this.root = rootEl;
    this.apiBase = opts.apiBase || '/api/estimate';
    this.model = new ValuationModel(this.apiBase);
  }

  init() {
    renderValuation(this.root);
    this.form = this.root.querySelector('#valuation-form');
    this.resultContainer = this.root.querySelector('#valuation-result');
    this.bindEvents();
  }

  bindEvents() {
    if (!this.form) return;

    const resetBtn = this.root.querySelector('#btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetForm());

    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  async onSubmit(e) {
    e.preventDefault();
    const form = this.form;
    const model = form.querySelector('#input-model').value.trim();
    const year = form.querySelector('#input-year').value;
    const mileage = form.querySelector('#input-mileage').value;
    const condition = form.querySelector('#input-condition').value;

    if (!model || !year || !mileage) {
      alert('Please complete all fields.');
      return;
    }

    // show loading/placeholder
    showResult(this.root, { estimate: '…', currency: '', explain: { status: 'calculating' } });

    try {
      const payload = { model, year: Number(year), mileage: Number(mileage), condition };
      const result = await this.model.estimate(payload);
      showResult(this.root, result);
      // broadcast for other parts of the app
      document.dispatchEvent(new CustomEvent('valuation:completed', { detail: result }));
    } catch (err) {
      console.error(err);
      showResult(this.root, null);
      alert('Failed to get estimate. Check console for details.');
    }
  }

  resetForm() {
    this.form.reset();
    showResult(this.root, null);
  }
}
