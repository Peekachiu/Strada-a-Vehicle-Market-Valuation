export class ValuationModel {
  constructor(apiBase = '/api/estimate') {
    this.apiBase = apiBase;
  }

  // Sends payload to backend API; in later steps we will point apiBase to your server.
  async estimate(payload) {
    // If you do not yet have a backend, uncomment the mock branch below to test locally:
    // return mockEstimate(payload);

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
}

/* Optional: local mock function you can enable for frontend-only testing
function mockEstimate(payload) {
  return new Promise(res => setTimeout(() => {
    const base = 20000;
    const currentYear = new Date().getFullYear();
    const ageFactor = Math.max(0, (currentYear - Number(payload.year)) * 0.05);
    const mileageFactor = Math.min(0.7, Number(payload.mileage) / 200000);
    const conditionMultiplier = { Excellent:1.05, Good:0.95, Fair:0.85, Poor:0.7 }[payload.condition] || 0.9;
    let estimate = Math.round(base * (1 - ageFactor) * (1 - mileageFactor) * conditionMultiplier);
    estimate = Math.max(estimate, 500);
    res({ estimate, currency: 'MYR', explain: { base, ageFactor, mileageFactor, conditionMultiplier }});
  }, 450));
}
*/

