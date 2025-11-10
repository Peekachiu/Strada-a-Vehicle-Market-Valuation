import { renderHero } from './views/heroView.js';
import { ValuationController } from './controllers/valuationController.js';

document.addEventListener('DOMContentLoaded', () => {
  // HEADER NAVBAR
  const header = document.getElementById('site-header');
  header.innerHTML = `
    <div class="container navbar">
      <div class="nav-left">
        <a class="brand" href="#">
          <img src="/assets/icons/logo-car.svg" alt="Strada Logo" class="brand-icon" />
          <span>Strada</span>
        </a>
      </div>

      <nav class="nav-links">
        <a href="#home" class="nav-item active"><span class="icon">🏠</span> Home</a>
        <a href="#about" class="nav-item"><span class="icon">ℹ️</span> About Us</a>
        <a href="#valuation" class="nav-item"><span class="icon">💲</span> Get Car Price</a>
        <a href="#login" class="nav-item">Login</a>
        <a href="#signup" class="btn btn-dark">Sign Up</a>
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
