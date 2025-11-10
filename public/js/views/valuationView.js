export function renderValuation(container) {
  container.innerHTML = `
    <section id="valuation-section" class="container">
      <div class="form-card">
        <h2>Get a valuation</h2>
        <p class="lead">Submit your vehicle details and get an instant estimate.</p>

        <form id="valuation-form" class="mt-4" novalidate>
          <div class="form-row">
            <label style="flex:1">
              <div>Make & Model</div>
              <input id="input-model" name="model" required placeholder="e.g. Toyota Corolla" />
            </label>

            <label style="width:140px">
              <div>Year</div>
              <input id="input-year" name="year" type="number" min="1900" max="${new Date().getFullYear()}" required />
            </label>
          </div>

          <div class="form-row">
            <label style="flex:1">
              <div>Mileage (km)</div>
              <input id="input-mileage" name="mileage" type="number" required />
            </label>

            <label style="width:160px">
              <div>Condition</div>
              <select id="input-condition" name="condition">
                <option>Excellent</option>
                <option selected>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </label>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button id="btn-estimate" class="btn btn-primary" type="submit">Get Estimate</button>
            <button id="btn-reset" type="button" class="btn btn-ghost">Reset</button>
          </div>
        </form>

        <div id="valuation-result" aria-live="polite"></div>
      </div>
    </section>
  `;
}

export function showResult(container, data) {
  const res = container.querySelector('#valuation-result');
  if (!res) return;

  if (!data) {
    res.innerHTML = '';
    return;
  }

  res.innerHTML = `
    <div class="result" role="status">
      <strong>Estimated price:</strong>
      <div style="font-size:1.4rem; margin-top:6px;">${data.currency} ${data.estimate.toLocaleString()}</div>
      <details style="margin-top:8px;">
        <summary>Why this price?</summary>
        <pre style="white-space:pre-wrap; margin-top:8px;">${JSON.stringify(data.explain, null, 2)}</pre>
      </details>
    </div>
  `;
}
