export class ValuationModel {
  constructor(apiBase = '/api/estimate') {
    this.apiBase = apiBase;
    this.basePrices = {
      'Toyota': 30000,
      'Honda': 28000,
      'Ford': 32000,
      'Chevrolet': 31000,
      'BMW': 45000,
      'Mercedes-Benz': 50000,
      'Audi': 43000,
      'Volkswagen': 27000,
      'Nissan': 26000,
      'Hyundai': 25000,
      'Kia': 24000,
      'Mazda': 27000,
      'default': 30000
    };
  }

  async estimate(payload) {
    // For now, we use the local mock calculation.
    // Later, you can swap this to call your ML model API.
    // return this._callApi(payload);
    return this._calculateMockValuation(payload);
  }

  // Real API call (for later)
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

  // New detailed mock calculation from your Figma code
  _calculateMockValuation(data) {
    return new Promise((resolve) => {
      setTimeout(() => { // Simulate network delay
        const basePrice = this.basePrices[data.make] || this.basePrices.default;
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(data.year);
        
        // Condition factor
        const conditionFactors = {
          'excellent': 1.15,
          'good': 1.0,
          'fair': 0.85,
          'poor': 0.65
        };
        const conditionFactor = conditionFactors[data.condition] || 1.0;
        
        // Mileage factor
        const mileage = parseInt(data.mileage);
        let mileageFactor = 1.0;
        if (mileage < 30000) mileageFactor = 1.1;
        else if (mileage < 60000) mileageFactor = 1.0;
        else if (mileage < 100000) mileageFactor = 0.9;
        else mileageFactor = 0.75;
        
        // Age factor (depreciation)
        const ageFactor = Math.max(0.5, 1 - (age * 0.08));
        
        // Demand factor (random for demo)
        const demandFactor = 0.95 + Math.random() * 0.15;
        
        const marketValue = Math.round(basePrice * conditionFactor * mileageFactor * ageFactor * demandFactor);
        const lowRange = Math.round(marketValue * 0.9);
        const highRange = Math.round(marketValue * 1.1);
        
        const result = {
          basePrice,
          marketValue,
          lowRange,
          highRange,
          factors: {
            condition: parseFloat(conditionFactor.toFixed(2)),
            mileage: parseFloat(mileageFactor.toFixed(2)),
            age: parseFloat(ageFactor.toFixed(2)),
            demand: parseFloat(demandFactor.toFixed(2))
          },
          vehicle: {
            make: data.make,
            model: data.model,
            year: data.year
          }
        };
        resolve(result);
      }, 450); // 450ms delay
    });
  }
}