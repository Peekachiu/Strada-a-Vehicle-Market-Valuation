import { renderHero } from './views/heroView.js';
import { ValuationController } from './controllers/valuationController.js';

document.addEventListener('DOMContentLoaded', () => {
  // header
  const header = document.getElementById('site-header');
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="#">Strada</a>
      <nav>
        <a href="#valuation">Valuation</a>
      </nav>
    </div>
  `;

  // render hero into main content
  const main = document.getElementById('main-content');
  renderHero(main);

  // create a container for the valuation view after hero
  const valuationContainer = document.createElement('div');
  valuationContainer.id = 'valuation-root';
  main.appendChild(valuationContainer);

  // init controller (client-side only for now; apiBase points to backend later)
  const valuationController = new ValuationController(valuationContainer, { apiBase: '/api/estimate' });
  valuationController.init();

  // set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // example: listen for valuation events
  document.addEventListener('valuation:completed', (e) => {
    console.log('Valuation completed:', e.detail);
  });
});
