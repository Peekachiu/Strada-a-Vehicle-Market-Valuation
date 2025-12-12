export const renderHistoryPage = (container) => {
  const html = `
    <section class="history-section" style="padding: 2rem 0;">
      <div class="container">
        <h2 style="margin-bottom: 1.5rem; text-align: center;">My Valuation History</h2>
        
        <div class="history-card" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div class="table-responsive">
            <table class="history-table" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8f9fa; text-align: left;">
                  <th style="padding: 1rem; border-bottom: 2px solid #dee2e6;">Date</th>
                  <th style="padding: 1rem; border-bottom: 2px solid #dee2e6;">Vehicle</th>
                  <th style="padding: 1rem; border-bottom: 2px solid #dee2e6;">Details</th>
                  <th style="padding: 1rem; border-bottom: 2px solid #dee2e6;">Estimated Price</th>
                </tr>
              </thead>
              <tbody id="history-table-body">
                <tr>
                  <td colspan="4" style="padding: 2rem; text-align: center;">Loading history...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
  container.innerHTML = html;
};

export const renderHistoryTableRows = (valuations) => {
  const tbody = document.getElementById('history-table-body');
  
  if (valuations.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="padding: 2rem; text-align: center; color: #666;">
          No valuations found. Go estimate a car!
        </td>
      </tr>`;
    return;
  }

  const rows = valuations.map(val => {
    // Format Date
    const date = new Date(val.created_at).toLocaleDateString('en-MY', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Format Price
    const price = new Intl.NumberFormat('en-MY', { 
      style: 'currency', currency: 'MYR' 
    }).format(val.predicted_price);

    return `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 1rem;">${date}</td>
        <td style="padding: 1rem;">
          <strong>${val.year} ${val.make} ${val.model}</strong>
        </td>
        <td style="padding: 1rem; font-size: 0.9rem; color: #555;">
          ${val.mileage.toLocaleString()} km<br>
        </td>
        <td style="padding: 1rem; font-weight: bold; color: #2c3e50;">
          ${price}
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rows;
};