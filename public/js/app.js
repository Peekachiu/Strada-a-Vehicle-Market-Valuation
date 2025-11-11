// public/js/app.js
import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { ValuationController } from './controllers/valuationController.js';

// Simple router
const router = {
  currentPage: 'home',
  
  navigate(page) {
    this.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  },
  
  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    if (this.currentPage === 'home') {
      // Render home page
      renderHero(main);
      
      // Add valuation container
      const valuationContainer = document.createElement('div');
      valuationContainer.id = 'valuation-root';
      main.appendChild(valuationContainer);
      
      // Init valuation controller
      const valuationController = new ValuationController(valuationContainer, { 
        apiBase: '/api/estimate' 
      });
      valuationController.init();
      
      // Set active nav (updated to "Get Car Price")
      const homeNav = document.querySelector('[href="#valuation"]');
      if (homeNav) homeNav.classList.add('active');
      
    } else if (this.currentPage === 'about') {
      // Render about page
      renderAbout(main);
      
      // Set active nav
      const aboutNav = document.querySelector('[href="#about"]');
      if (aboutNav) aboutNav.classList.add('active');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // HEADER NAVBAR (Re-designed)
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <div class="container navbar">
        <div class="nav-left">
          <a class="brand" href="#home">
            <span>Strada</span>
          </a>
        </div>

        <nav class="nav-links" aria-label="Main navigation">
          <a href="#about" class="nav-item">About Us</a>
          <a href="#valuation" class="nav-item">Get Car Price</a>
          <a href="#features" class="nav-item">Features</a>
        </nav>

        <div class="nav-auth">
          <a href="#login" class="nav-item">Login</a>
          <a href="#signup" class="btn btn-dark">Sign Up</a>
        </div>
      </div>
    `;
  } else {
    console.warn('site-header element not found.');
  }

  // Handle navigation clicks
  document.querySelectorAll('.nav-item, .brand').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#home') {
        e.preventDefault();
        router.navigate('home');
      } else if (href === '#about') {
        e.preventDefault();
        router.navigate('about');
      } else if (href === '#valuation') {
        e.preventDefault();
        router.navigate('home');
        setTimeout(() => {
          const valuationEl = document.getElementById('valuation-root');
          if (valuationEl) {
            valuationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else if (href === '#features') { // Added handler for Features
        e.preventDefault();
        router.navigate('home');
        setTimeout(() => {
          const featuresEl = document.getElementById('why'); // Scrolls to 'Why Choose Strada?'
          if (featuresEl) {
            featuresEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  });

  // Initial render based on hash
  const hash = window.location.hash.slice(1);
  if (hash === 'about') {
    router.navigate('about');
  } else {
    router.navigate('home');
  }

  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1) || 'home';
    if (page === 'about' || page === 'home') {
      router.navigate(page);
    }
  });

  // Set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Listen for valuation events
  document.addEventListener('valuation:completed', (e) => {
    console.log('Valuation completed:', e.detail);
  });
});