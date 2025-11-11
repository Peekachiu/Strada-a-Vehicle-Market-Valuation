// public/js/app.js
import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js'; // <-- 1. IMPORT
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
    if (!main) {
      console.error("'main-content' element not found!");
      return;
    }
    main.innerHTML = '';
    
    // Update active nav item
    document.querySelectorAll('.nav-item, .btn-dark').forEach(item => {
      item.classList.remove('active');
    });
    
    if (this.currentPage === 'home') {
      // Render home page
      renderHero(main);
      
      const valuationContainer = document.createElement('div');
      valuationContainer.id = 'valuation-root';
      main.appendChild(valuationContainer);
      
      const valuationController = new ValuationController(valuationContainer, { 
        apiBase: '/api/estimate' 
      });
      valuationController.init();
      
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

    } else if (this.currentPage === 'signup') { // <-- 2. ADD SIGNUP RENDER
      // Render signup page
      renderSignUp(main);

      const signupNav = document.querySelector('[href="#signup"]');
      if (signupNav) signupNav.classList.add('active');
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
          <a class="brand" href="#home">
            <img src="/assets/images/strada_logo.jpg" onerror="this.style.display='none'" alt="Strada logo" class="brand-icon" />
            <div class="brand-icon-fallback" aria-hidden="true">🚗</div>
            <span>Strada</span>
          </a>
        </div>

        <nav class="nav-links" aria-label="Main navigation">
          <a href="#home" class="nav-item">Home</a>
          <a href="#about" class="nav-item">About Us</a>
          <a href="#valuation" class="nav-item">Get Car Price</a>
          <a href="#login" class="nav-item">Login</a>
          <a href="#signup" class="btn btn-dark">Sign Up</a>
        </nav>
      </div>
    `;
  } else {
    console.warn('site-header element not found.');
  }

  // Handle navigation clicks
  document.body.addEventListener('click', (e) => { // Use event delegation on body
    const target = e.target.closest('a'); // Find the clicked link
    
    if (!target) return; // Exit if click wasn't on a link
    
    const href = target.getAttribute('href');

    if (href === '#home') {
      e.preventDefault();
      router.navigate('home');
    } else if (href === '#about') {
      e.preventDefault();
      router.navigate('about');
    } else if (href === '#login') {
      e.preventDefault();
      router.navigate('login');
    } else if (href === '#signup') { // <-- 3. ADD SIGNUP CLICK HANDLER
      e.preventDefault();
      router.navigate('signup');
    } else if (href === '#valuation') {
      e.preventDefault();
      router.navigate('home');
      setTimeout(() => {
        const valuationEl = document.getElementById('valuation-root');
        if (valuationEl) {
          valuationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  });

  // Initial render based on hash
  const hash = window.location.hash.slice(1);
  if (hash === 'about') {
    router.navigate('about');
  } else if (hash === 'login') {
    router.navigate('login');
  } else if (hash === 'signup') { // <-- 4. ADD SIGNUP HASH CHECK
    router.navigate('signup');
  } else {
    router.navigate('home');
  }

  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1) || 'home';
    if (page === 'about' || page === 'home' || page === 'login' || page === 'signup') { // <-- 5. ADD SIGNUP TO HASHCHANGE
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