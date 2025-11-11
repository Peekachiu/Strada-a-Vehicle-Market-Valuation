// public/js/app.js
import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js';
import { renderValuationPage } from './views/valuationView.js'; // Import the page renderer
import { ValuationController } from './controllers/valuationController.js'; 

// Simple router
const router = {
  currentPage: 'home',
  
  navigate(page) {
    // Update the URL hash
    window.location.hash = page;
    this.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  },
  
  render() {
    const main = document.getElementById('main-content');
    if (!main) {
      console.error("'main-content' element not found!");
      return;
    }
    main.innerHTML = '';
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    if (this.currentPage === 'home') {
      // Render home page
      renderHero(main);
      
      // --- VALUATION FORM IS NO LONGER RENDERED HERE ---
      
      const homeNav = document.querySelector('[href="#home"]');
      if (homeNav) homeNav.classList.add('active');
      
    } else if (this.currentPage === 'about') {
      // Render about page
      renderAbout(main);
      
      const aboutNav = document.querySelector('[href="#about"]');
      if (aboutNav) aboutNav.classList.add('active');

    } else if (this.currentPage === 'login') { 
      // Render login page
      renderLogin(main);

      const loginNav = document.querySelector('[href="#login"]');
      if (loginNav) loginNav.classList.add('active');
      
    } else if (this.currentPage === 'signup') { 
      // Render sign up page
      renderSignUp(main);

      const signupNav = document.querySelector('[href="#signup"]');
      if (signupNav) signupNav.classList.add('active');
      
    } else if (this.currentPage === 'valuation') { 
      // Render valuation page
      renderValuationPage(main);
      
      // Init valuation controller on its own page
      // --- THIS IS THE FIX ---
      // We now use 'main' as the container, not 'valuation-root'
      const valuationContainer = main; 
      if (valuationContainer) {
        const valuationController = new ValuationController(valuationContainer);
        valuationController.init();
      }

      const valuationNav = document.querySelector('[href="#valuation"]');
      if (valuationNav) valuationNav.classList.add('active');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // HEADER NAVBAR
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <div class="container navbar">
        <div class="nav-left">
          <a class="brand" href="#home" data-navigate="home">
            <img src="/assets/images/strada_logo.jpg" onerror="this.style.display='none'" alt="Strada logo" class="brand-icon" />
            <div class="brand-icon-fallback" aria-hidden="true">🚗</div>
            <span>Strada</span>
          </a>
        </div>

        <nav class="nav-links" aria-label="Main navigation">
          <a href="#home" class="nav-item" data-navigate="home">Home</a>
          <a href="#about" class="nav-item" data-navigate="about">About Us</a>
          <a href="#valuation" class="nav-item" data-navigate="valuation">Get Car Price</a>
          <a href="#login" class="nav-item" data-navigate="login">Login</a>
          <a href="#signup" class="btn btn-dark" data-navigate="signup">Sign Up</a>
        </nav>
      </div>
    `;
  } else {
    console.warn('site-header element not found.');
  }

  // Handle navigation clicks
  document.body.addEventListener('click', (e) => { 
    const target = e.target.closest('a[data-navigate], button[data-navigate]');
    
    if (!target) return; 
    
    e.preventDefault();
    const page = target.getAttribute('data-navigate');
    
    if (page && page !== router.currentPage) {
      router.navigate(page);
    } else if (page === 'home') {
      // Allow re-navigating to home
      router.navigate('home');
    }
  });

  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1) || 'home';
    if (['home', 'about', 'login', 'signup', 'valuation'].includes(page)) {
      if (page !== router.currentPage) {
        router.navigate(page);
      }
    }
  });
  
  // Initial render based on hash
  const initialPage = window.location.hash.slice(1) || 'home';
  if (['home', 'about', 'login', 'signup', 'valuation'].includes(initialPage)) {
    router.navigate(initialPage);
  } else {
    router.navigate('home');
  }

  // Set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Listen for valuation events
  document.addEventListener('valuation:completed', (e) => {
    console.log('Valuation completed:', e.detail);
  });
});