import { renderHero } from './views/heroView.js';
import { renderAbout } from './views/aboutView.js';
import { renderLogin } from './views/loginView.js';
import { renderSignUp } from './views/signupView.js';
import { renderValuationPage } from './views/valuationView.js';
import { renderCalculatorPage } from './views/calculatorView.js';
import { renderRoadTaxPage } from './views/roadTaxView.js';
import { renderInsurancePage } from './views/insuranceView.js';
import { renderAffordabilityPage } from './views/affordabilityView.js';
import { renderDepreciationPage } from './views/depreciationView.js';
import { renderGallery } from './views/galleryView.js';
import { renderShopPage } from './views/shopView.js';
import { renderCartPage } from './views/cartView.js';
import { renderCheckoutPage } from './views/checkoutView.js';
import { renderOrdersPage } from './views/ordersView.js';
import { ShopController } from './controllers/shopController.js';
import { ValuationController } from './controllers/valuationController.js';
import { CalculatorController } from './controllers/calculatorController.js';
import { RoadTaxController } from './controllers/roadTaxController.js';
import { InsuranceController } from './controllers/insuranceController.js';
import { AffordabilityController } from './controllers/affordabilityController.js';
import { DepreciationController } from './controllers/depreciationController.js';
import { LoginController } from './controllers/loginController.js';
import { SignUpController } from './controllers/signupController.js';

import { ProfileController } from './controllers/profileController.js';
import { Modal } from './components/Modal.js';
import { termsOfServiceContent, privacyPolicyContent } from './utils/legalContent.js';

// Global state for the app
const appState = {
  currentUser: null // Will be { displayName: 'username' }
};

function isUserLoggedIn() {
  const token = localStorage.getItem('accessToken');
  return !!token;
}

/**
 * Helper function to get user info from the token
 * A JWT token contains the user's data (like username)
 * This function decodes it.
 */
function getUserFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      displayName: payload.username || 'User'
    };
  } catch (e) {
    console.error("Failed to decode token:", e);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
}

/**
 * Logs the user out by clearing tokens and re-rendering.
 */
function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  appState.currentUser = null;
  renderHeader(null);
  router.navigate('login');
}

/**
 * Renders the new, conflict-free Navbar.
 */
function renderHeader(user) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const loggedIn = isUserLoggedIn();
  const userName = user?.displayName || 'User';
  const userEmail = user?.email || 'Manage Account';
  const userInitial = userName.charAt(0).toUpperCase();

  // Helper for active state
  const isActive = (page) => router.currentPage === page ? 'active' : '';

  // Your Logo Image
  const logoHTML = `<img src="/images/strada_logo.jpg" alt="Strada" class="nav-logo-img">`;

  // Icons
  const icons = {
    home: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    info: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    gallery: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    money: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    calc: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="18" x2="16" y2="18"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
    user: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    logout: `<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
  };

  if (loggedIn && user) {
    // --- LOGGED IN ---
    header.innerHTML = `
      <nav class="site-navbar">
        <a class="nav-brand" href="#home" data-navigate="home">
          <div class="nav-logo-wrapper">
            ${logoHTML}
          </div>
          <span class="nav-brand-text">Strada</span>
        </a>

        <div class="site-nav-links">
          <button class="site-nav-item ${isActive('home')}" data-navigate="home">
            ${icons.home} Home
          </button>
          <button class="site-nav-item ${isActive('about')}" data-navigate="about">
            ${icons.info} About Us
          </button>
          <button class="site-nav-item ${isActive('gallery')}" data-navigate="gallery">
            ${icons.gallery} Gallery
          </button>
          <button class="site-nav-item ${isActive('valuation')}" data-navigate="valuation">
            ${icons.money} Get Car Price
          </button>
          
          <div class="nav-item-dropdown-wrapper">
            <button class="site-nav-item ${isActive('calculator') || isActive('road-tax') || isActive('insurance-calculator') || isActive('affordability-calculator') || isActive('depreciation-calculator') ? 'active' : ''}" id="calc-menu-btn">
              ${icons.calc} Calculation
            </button>
            <div class="nav-dropdown" id="calc-dropdown">
               <a class="nav-dropdown-item" data-navigate="calculator">
                Loan Calculator
              </a>
              <a class="nav-dropdown-item" data-navigate="road-tax">
                Road Tax Calculator
              </a>
              <a class="nav-dropdown-item" data-navigate="insurance-calculator">
                Insurance Estimator
              </a>
              <a class="nav-dropdown-item" data-navigate="affordability-calculator">
                Affordability Calculator
              </a>
              <a class="nav-dropdown-item" data-navigate="depreciation-calculator">
                Depreciation Simulator
              </a>
            </div>
          </div>

          <button class="site-nav-item ${isActive('shop') ? 'active' : ''}" data-navigate="shop">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Shop
          </button>

        </div>

        <div class="nav-user-section">
          <button class="site-nav-item cart-nav-btn" data-navigate="cart" id="cart-icon-btn">
            <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="cart-badge" id="cart-badge" style="display: none;">0</span>
          </button>

          <div class="nav-avatar-btn" id="user-menu-btn">
            ${userInitial}
          </div>
          
          <div class="nav-dropdown" id="user-dropdown">
            <div class="nav-dropdown-header">
              <p class="nav-user-name">${userName}</p>
              <p class="nav-user-email">${userEmail}</p>
            </div>
            <a class="nav-dropdown-item" data-navigate="profile">
              ${icons.user} Profile
            </a>
            <a class="nav-dropdown-item" data-navigate="orders">
              <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="22" y2="10"/></svg>
              My Orders
            </a>
            <a class="nav-dropdown-item" id="logout-btn">
              ${icons.logout} Log out
            </a>
          </div>
        </div>
      <button class="mobile-menu-btn" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </nav>
    `;
  } else {
    // --- GUEST ---
    header.innerHTML = `
      <nav class="site-navbar">
        <a class="nav-brand" href="#login" data-navigate="login">
          <div class="nav-logo-wrapper">
            ${logoHTML}
          </div>
          <span class="nav-brand-text">Strada</span>
        </a>

        <div class="site-nav-links guest-mode">
          <button class="site-nav-item" data-navigate="login">Login</button>
          <button class="site-nav-item active" data-navigate="signup">Sign Up</button>
        </div>
      <button class="mobile-menu-btn" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </nav>
    `;
  }
}

/**
 * Updates the cart badge count from the server.
 * Called after renderHeader to ensure badge reflects actual cart state.
 */
async function updateCartBadge() {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const res = await fetch('/api/shop/cart/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const data = await res.json();
      const badge = document.getElementById('cart-badge');
      if (badge) {
        const count = data.item_count || 0;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      }
    }
  } catch (e) {
    // Silently fail - badge will show on next successful fetch
  }
}

// --- ROUTER & PAGE RENDERING ---

const router = {
  currentPage: null,

  navigate(page, fromHashChange = false) {
    if (page === this.currentPage) return;

    const loggedIn = isUserLoggedIn(); // Check token
    const authPages = ['login', 'signup'];
    const isAuthPage = authPages.includes(page);

    // 1. If user is NOT logged in and tries to access a protected page
    if (!loggedIn && !isAuthPage) {
      console.log("Guest trying to access protected page. Redirecting to login.");
      this.navigate('login');
      return;
    }

    // 2. If user IS logged in and tries to access login/signup
    if (loggedIn && isAuthPage) {
      console.log("User already logged in. Redirecting to home.");
      this.navigate('home');
      return;
    }

    // 3. Allow navigation
    // Only set hash if NOT triggered by hashchange (avoid infinite loop)
    if (!fromHashChange) {
      window.location.hash = page;
    }
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

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const authPages = ['login', 'signup'];
    if (authPages.includes(this.currentPage)) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }

    const page = this.currentPage;
    let activeNavSelector = `[data-navigate="${page}"]`;

    if (page === 'home') {
      renderHero(main);
    } else if (page === 'about') {
      renderAbout(main);
    } else if (page === 'login') {
      renderLogin(main);
      new LoginController(main, this, appState, renderHeader);
    } else if (page === 'signup') {
      renderSignUp(main);
      new SignUpController(main, this, appState, renderHeader);
    } else if (page === 'valuation') {
      renderValuationPage(main);
      const valuationController = new ValuationController(main);
      valuationController.init();
    } else if (page === 'calculator') {
      renderCalculatorPage(main);
      const calculatorController = new CalculatorController(main);
      calculatorController.init();
    } else if (page === 'road-tax') {
      renderRoadTaxPage(main);
      const roadTaxController = new RoadTaxController(main);
      roadTaxController.init();
    } else if (page === 'insurance-calculator') {
      renderInsurancePage(main);
      const insuranceController = new InsuranceController(main);
      insuranceController.init();
    } else if (page === 'affordability-calculator') {
      renderAffordabilityPage(main);
      const affordabilityController = new AffordabilityController(main);
      affordabilityController.init();
    } else if (page === 'depreciation-calculator') {
      renderDepreciationPage(main);
      const depreciationController = new DepreciationController(main);
      depreciationController.init();
    } else if (page === 'gallery') {
      renderGallery(main);
    } else if (page === 'shop') {
      renderShopPage(main);
      const shopController = new ShopController(main);
      shopController.init();
    } else if (page === 'cart') {
      renderCartPage(main);
    } else if (page === 'checkout') {
      renderCheckoutPage(main);
    } else if (page === 'orders') {
      renderOrdersPage(main);
    } else if (page === 'my-valuations') {
      main.innerHTML = `<div class="container" style="padding: 4rem 0;"><h1 class="auth-title">My Valuations</h1><p class="auth-sub">Your saved valuations will appear here.</p></div>`;
    } else if (page === 'profile') {
      // We use the Controller now, instead of calling the View directly
      const profileController = new ProfileController(main);
      profileController.init();
    } else {
      // 404
      this.navigate(isUserLoggedIn() ? 'home' : 'login'); // Default to home or login
      return;
    }

    const activeNav = document.querySelector(activeNavSelector);
    if (activeNav) activeNav.classList.add('active');

    // Re-initialize scroll animations for new content
    if (window.initScrollAnimations) {
      setTimeout(window.initScrollAnimations, 100); // Small delay to ensure DOM is ready
    }
  }
};

// --- APP INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
  console.log("Strada app initializing...");

  // 1. Set up navigation
  document.body.addEventListener('click', (e) => {
    const navTarget = e.target.closest('a[data-navigate], button[data-navigate]');
    
    // Mobile Menu Toggle
    if (e.target.closest('.mobile-menu-btn')) {
      document.querySelector('.site-nav-links')?.classList.toggle('active');
    }

    if (navTarget) {
      e.preventDefault();
      // Close mobile menu on navigate
      document.querySelector('.site-nav-links')?.classList.remove('active');
      
      const page = navTarget.getAttribute('data-navigate');
      router.navigate(page);
      return;
    }

    // Handle REAL logout
    if (e.target.closest('#logout-btn')) {
      e.preventDefault();
      handleLogout();
      return;
    }

    // Handle dropdown toggle (User Menu)
    if (e.target.closest('#user-menu-btn')) {
      document.getElementById('user-dropdown')?.classList.toggle('active');
      document.getElementById('calc-dropdown')?.classList.remove('active'); // Close other
    }
    // Handle dropdown toggle (Calculation Menu)
    else if (e.target.closest('#calc-menu-btn')) {
      document.getElementById('calc-dropdown')?.classList.toggle('active');
      document.getElementById('user-dropdown')?.classList.remove('active'); // Close other
    } else {
      // Close all if clicked outside
      document.getElementById('user-dropdown')?.classList.remove('active');
      document.getElementById('calc-dropdown')?.classList.remove('active');
    }
  });

  // 2. Handle browser back/forward and initial page load
  const handleHashChange = () => {
    const page = window.location.hash.slice(1);
    const loggedIn = isUserLoggedIn();

    // On first load, set the user state
    if (loggedIn) {
      appState.currentUser = getUserFromToken();
    } else {
      appState.currentUser = null;
    }

    // Re-render header on every navigation
    renderHeader(appState.currentUser);
    updateCartBadge();

    const authPages = ['login', 'signup'];
    const isAuthPage = authPages.includes(page);

    if (!loggedIn && !isAuthPage) {
      router.navigate('login');
    } else if (loggedIn && isAuthPage) {
      router.navigate('home');
    } else {
      router.navigate(page || (loggedIn ? 'home' : 'login'), true);
    }
  };

  window.addEventListener('hashchange', handleHashChange);

  // 5. Initial Page Load
  handleHashChange(); // This sets up the correct initial page

  // 6. Set footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // 7. Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Function to observe elements (can be called after dynamic content loads)
  window.initScrollAnimations = () => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  };

  // 8. Footer Legal Links (Global)
  const footerTerms = document.getElementById('footer-terms');
  const footerPrivacy = document.getElementById('footer-privacy');
  // Reusing the same modal instance might be tricky if we don't have a global one.
  // Ideally, one modal instance for the app or instantiated on demand.
  const globalModal = new Modal();

  if (footerTerms) {
    footerTerms.addEventListener('click', (e) => {
      e.preventDefault();
      globalModal.create('Terms of Service', termsOfServiceContent);
    });
  }

  if (footerPrivacy) {
    footerPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      globalModal.create('Privacy Policy', privacyPolicyContent);
    });
  }

  // Initial check
  window.initScrollAnimations();
});