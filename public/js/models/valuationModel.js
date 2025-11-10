// public/js/models/valuationModel.js
// Frontend model that calls a backend API by default.
// For frontend-only testing we use the local mockEstimate() function.
// When you have a real backend, change apiBase or restore the network call.

export class ValuationModel {
  constructor(apiBase = '/api/estimate') {
    this.apiBase = apiBase;
  }

  // For frontend-only testing, this method uses the mock.
  // To use a real backend later, replace the body with the fetch() call (comment below).
  async estimate(payload) {
    // return this._callApi(payload); // <-- Uncomment this line to call real API
    return this._mockEstimate(payload);
  }

  // Real API call (keep for later)
  async _callApi(payload) {
    const res = await fetch(this.apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:'unknown'}));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  }

  // Local mock used for frontend-only testing
  _mockEstimate(payload) {
    return new Promise(res => setTimeout(() => {
      const base = 20000;
      const currentYear = new Date().getFullYear();
      const ageFactor = Math.max(0, (currentYear - Number(payload.year)) * 0.05);
      const mileageFactor = Math.min(0.7, Number(payload.mileage) / 200000);
      const conditionMultiplier = { Excellent:1.05, Good:0.95, Fair:0.85, Poor:0.7 }[payload.condition] || 0.9;
      let estimate = Math.round(base * (1 - ageFactor) * (1 - mileageFactor) * conditionMultiplier);
      estimate = Math.max(estimate, 500);

      const explain = {
        base,
        ageFactor: Number(ageFactor.toFixed(3)),
        mileageFactor: Number(mileageFactor.toFixed(3)),
        conditionMultiplier
      };

      res({ estimate, currency: 'MYR', explain });
    }, 450));
  }
}
